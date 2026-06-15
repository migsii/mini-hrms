<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\SalaryController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Default fallback authentication route (Sanctum)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Employee CRUD Management Endpoints
Route::apiResource('employees', EmployeeController::class);

// Employee Salary Mapping Endpoints
Route::post('salaries', [SalaryController::class, 'store']);
Route::get('salaries/{employee_id}', [SalaryController::class, 'show']);

// Employee Attendance Mapping Endpoints
Route::get('attendances', [AttendanceController::class, 'index']);
Route::post('attendances', [AttendanceController::class, 'store']);
Route::get('attendances/employee/{employee_id}', [AttendanceController::class, 'show']);

// Employee Payrolls Mapping Endpoints
Route::get('payrolls', [PayrollController::class, 'index']);
Route::post('payrolls', [PayrollController::class, 'store']);

// Dashboard analytics resource
Route::get('dashboard/summary', [DashboardController::class, 'index']);