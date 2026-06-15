<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payroll;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Retrieve aggregated metrics for the administration dashboard.
     */
    public function index()
    {
        // Employee Count Metrics based on status flags
        $totalEmployees = Employee::count();
        $activeEmployees = Employee::where('employment_status', 'Active')->count();
        $employeesOnLeave = Employee::where('employment_status', 'On Leave')->count();

        // Financial Metrics: Calculate current month's total operational payroll expenses
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $totalMonthlyPayroll = Payroll::whereMonth('payroll_date', $currentMonth)
            ->whereYear('payroll_date', $currentYear)
            ->sum('net_salary');

        // Construct payload response
        return response()->json([
            'total_employees'       => $totalEmployees,
            'active_employees'      => $activeEmployees,
            'employees_on_leave'    => $employeesOnLeave,
            'total_monthly_payroll' => $totalMonthlyPayroll,
        ], 200);
    }
}