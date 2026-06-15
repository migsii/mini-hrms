<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\Api\PayrollController;
use Illuminate\Support\Facades\Schedule;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::call(function () {
    $targetDate = Carbon::now()->toDateString();
    
    $controller = new PayrollController();
    $controller->initiateMonthlyPayroll($targetDate);
})->lastDayOfMonth('23:59');