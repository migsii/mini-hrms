<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Salary;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    /**
     * Store or update the salary configuration for an employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id'  => 'required|integer|exists:employees,id',
            'basic_salary' => 'required|numeric|min:0',
            'allowance'    => 'required|numeric|min:0',
            'deductions'   => 'required|numeric|min:0',
        ]);

        // Calculate net salary based on business rules
        $netSalary = $validated['basic_salary'] + $validated['allowance'] - $validated['deductions'];

        // Find existing salary record or initialize a new instance
        $salary = Salary::firstOrNew(['employee_id' => $validated['employee_id']]);

        // Assign computed and validated data
        $salary->basic_salary = $validated['basic_salary'];
        $salary->allowance    = $validated['allowance'];
        $salary->deductions   = $validated['deductions'];
        $salary->net_salary   = $netSalary;
        $salary->save();

        return response()->json([
            'message' => 'Salary details processed successfully!',
            'data'    => $salary
        ], 200);
    }

    /**
     * Display the salary configuration for a specific employee.
     */
    public function show(string $employeeId)
    {
        $salary = Salary::where('employee_id', $employeeId)->first();

        if (!$salary) {
            return response()->json(['message' => 'Salary record not found for this employee'], 404);
        }

        return response()->json($salary, 200);
    }
}