<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    /**
     * Display a listing of all processed historical payroll logs.
     */
    public function index()
    {
        return response()->json(Payroll::with('employee')->orderBy('payroll_date', 'desc')->get(), 200);
    }

    /**
     * Generate and lock a new payroll record for a specific employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id'  => 'required|integer|exists:employees,id',
            'payroll_date' => 'required|date',
        ]);

        // Retrieve employee record complete with mapped salary profile
        $employee = Employee::with('salary')->find($validated['employee_id']);

        // Error handling if salary profile hasn't been established yet
        if (!$employee->salary) {
            return response()->json([
                'message' => 'Cannot generate payroll. Salary details not configured for this employee.'
            ], 422);
        }

        // Pull active parameters from the salary relation configuration
        $basicSalary = $employee->salary->basic_salary;
        $allowance   = $employee->salary->allowance;
        $deductions  = $employee->salary->deductions;
        
        // Execute business logic calculation
        $netSalary = $basicSalary + $allowance - $deductions;

        // Prevent duplicate payroll entries for the same employee on the same date
        $payroll = Payroll::firstOrNew([
            'employee_id'  => $validated['employee_id'],
            'payroll_date' => $validated['payroll_date']
        ]);

        $payroll->basic_salary = $basicSalary;
        $payroll->allowance    = $allowance;
        $payroll->deductions   = $deductions;
        $payroll->net_salary   = $netSalary;
        $payroll->save();

        return response()->json([
            'message' => 'Payroll generated and logged successfully!',
            'data'    => $payroll->load('employee')
        ], 201);
    }

    /**
     * Automated Batch Processor: Generates payroll for all valid, active employees.
     */
    public function initiateMonthlyPayroll(string $targetDate)
    {
        $employees = Employee::whereNot('employment_status', 'Resigned')
            ->with('salary')
            ->get();

        $processedCount = 0;

        foreach ($employees as $employee) {
            if (!$employee->salary) {
                continue;
            }

            $basicSalary = $employee->salary->basic_salary;
            $allowance   = $employee->salary->allowance;
            $deductions  = $employee->salary->deductions;
            $netSalary   = $basicSalary + $allowance - $deductions;


            Payroll::updateOrCreate(
                [
                    'employee_id'  => $employee->id,
                    'payroll_date' => $targetDate,
                ],
                [
                    'basic_salary' => $basicSalary,
                    'allowance'    => $allowance,
                    'deductions'   => $deductions,
                    'net_salary'   => $netSalary,
                ]
            );

            $processedCount++;
        }

        return $processedCount;
    }
}