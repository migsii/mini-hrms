<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Employee::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'         => 'required|string|max:255',
            'email'             => 'required|email|unique:employees,email',
            'contact_number'    => 'required|string',
            'position'          => 'required|string',
            'department'        => 'required|string',
            'date_hired'        => 'required|date',
            'employment_status' => 'required|in:Active,Resigned,On Leave',
        ]);

        $employee = Employee::create($validated);
        return response()->json([
            'message' => 'Employee created successfully!',
            'data'    => $employee
        ], 201); // 201 means "Created"
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employee = Employee::find($id);

        // Handle case where employee ID doesn't exist
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json($employee, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
        $validated = $request->validate([
            'full_name'         => 'sometimes|string|max:255',
            'email'             => 'sometimes|email|unique:employees,email,' . $id,
            'contact_number'    => 'sometimes|string',
            'position'          => 'sometimes|string',
            'department'        => 'sometimes|string',
            'date_hired'        => 'sometimes|date',
            'employment_status' => 'sometimes|in:Active,Resigned,On Leave',
        ]);

        $employee->update($validated);

        return response()->json([
            'message' => 'Employee updated successfully!',
            'data'    => $employee
        ], 200);
    }

    public function destroy(string $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully!'], 200);
    }
}