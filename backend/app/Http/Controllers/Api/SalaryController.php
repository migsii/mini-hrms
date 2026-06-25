<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salary;
use App\Models\Payroll;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    /**
     * Store a newly created salary configuration for an employee.
     */
    public function store(Request $request)
        {
            $validated = $request->validate([
                'employee_id'  => 'required|exists:employees,id',
                'basic_salary' => 'required|numeric|min:0',
                'allowance'    => 'nullable|numeric|min:0',
                'deductions'   => 'nullable|numeric|min:0',
            ]);

            $validated['allowance']  = $validated['allowance'] ?? 0;
            $validated['deductions'] = $validated['deductions'] ?? 0;
            $validated['net_salary'] = $validated['basic_salary']
                + $validated['allowance']
                - $validated['deductions'];

            $salary = Salary::create($validated);

            Payroll::updateOrCreate(
                ['employee_id' => $salary->employee_id],
                [
                    'basic_salary' => $salary->basic_salary,
                    'allowance'    => $salary->allowance,
                    'deductions'   => $salary->deductions,
                    'net_salary'   => $salary->net_salary,
                    'payroll_date' => now(),
                ]
            );

            return response()->json($salary, 201);
        }

    /**
     * Update an existing salary configuration using the employee_id.
     */
    public function update(Request $request, int $emp_id)
        {
            $salary = Salary::where('employee_id', $emp_id)->firstOrFail();

            $validated = $request->validate([
                'basic_salary' => 'sometimes|numeric|min:0',
                'allowance'    => 'sometimes|numeric|min:0',
                'deductions'   => 'sometimes|numeric|min:0',
            ]);

            $salary->update([
                'basic_salary' => $validated['basic_salary'] ?? $salary->basic_salary,
                'allowance'    => $validated['allowance'] ?? $salary->allowance,
                'deductions'   => $validated['deductions'] ?? $salary->deductions,
                'net_salary'   => ($validated['basic_salary'] ?? $salary->basic_salary)
                    + ($validated['allowance'] ?? $salary->allowance)
                    - ($validated['deductions'] ?? $salary->deductions),
            ]);

            Payroll::updateOrCreate(
                ['employee_id' => $salary->employee_id],
                [
                    'basic_salary' => $salary->basic_salary,
                    'allowance'    => $salary->allowance,
                    'deductions'   => $salary->deductions,
                    'net_salary'   => $salary->net_salary,
                    'payroll_date' => now(),
                ]
            );

            return response()->json($salary);
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