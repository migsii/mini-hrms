<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of all recorded attendances.
     */
    public function index()
    {
        return response()->json(Attendance::with('employee')->get(), 200);
    }

    /**
     * Record or update an employee attendance entry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|integer|exists:employees,id',
            'date'        => 'required|date',
            'time_in'     => 'nullable|date_format:H:i',
            'time_out'    => 'nullable|date_format:H:i',
            'status'      => 'required|in:Present,Late,Absent,On Leave',
        ]);

        // Find existing attendance for that employee on that specific date, or create a new instance
        $attendance = Attendance::firstOrNew([
            'employee_id' => $validated['employee_id'],
            'date'        => $validated['date']
        ]);

        $attendance->time_in  = $validated['time_in'];
        $attendance->time_out = $validated['time_out'];
        $attendance->status   = $validated['status'];
        $attendance->save();

        return response()->json([
            'message' => 'Attendance record saved successfully!',
            'data'    => $attendance
        ], 200);
    }

    /**
     * Display historical attendance records for a specific employee.
     */
    public function show(string $employeeId)
    {
        $records = Attendance::where('employee_id', $employeeId)->orderBy('date', 'desc')->get();

        if ($records->isEmpty()) {
            return response()->json(['message' => 'No attendance records found for this employee'], 404);
        }

        return response()->json($records, 200);
    }
}