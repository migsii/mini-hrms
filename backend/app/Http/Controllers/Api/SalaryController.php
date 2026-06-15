<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Salary;
use Illuminate\Http\Request;

class SalaryController extends Controller
{
    /**
     * Store a newly created salary configuration for an employee.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id'  => 'required|integer|unique:salaries,employee_id|exists:employees,id',
            'basic_salary' => 'required|numeric|min:0',
            'allowance'    => 'required|numeric|min:0',
            'deductions'   => 'required|numeric|min:0',
        ]);

        // Calculate net salary based on basic business rules
        $netSalary = $validated['basic_salary'] + $validated['allowance'] - $validated['deductions'];

        $salary = Salary::create([
            'employee_id'  => $validated['employee_id'],
            'basic_salary' => $validated['basic_salary'],
            'allowance'    => $validated['allowance'],
            'deductions'   => $validated['deductions'],
            'net_salary'   => $netSalary,
        ]);

        return response()->json([
            'message' => 'Salary configuration created successfully!',
            'data'    => $salary
        ], 201);
    }

    /**
     * Update an existing salary configuration using the employee_id.
     */
    public function update(Request $request, string $employeeId)
    {
        // Find the target salary configuration record
        $salary = Salary::where('employee_id', $employeeId)->first();

        if (!$salary) {
            return response()->json(['message' => 'Salary record not found for this employee'], 404);
        }

        // Validate incoming payload (fields are optional via 'sometimes')
        $validated = $request->validate([
            'basic_salary' => 'sometimes|required|numeric|min:0',
            'allowance'    => 'sometimes|required|numeric|min:0',
            'deductions'   => 'sometimes|required|numeric|min:0',
        ]);

        // Fallback to existing record values if a field isn't passed in the update request
        $basicSalary = $validated['basic_salary'] ?? $salary->basic_salary;
        $allowance   = $validated['allowance'] ?? $salary->allowance;
        $deductions  = $validated['deductions'] ?? $salary->deductions;
        
        // Compute updated flat net take-home calculation
        $netSalary = $basicSalary + $allowance - $deductions;

        $salary->update([
            'basic_salary' => $basicSalary,
            'allowance'    => $allowance,
            'deductions'   => $deductions,
            'net_salary'   => $netSalary,
        ]);

        return response()->json([
            'message' => 'Salary configuration updated successfully!',
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