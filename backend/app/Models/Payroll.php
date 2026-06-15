<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'basic_salary',
        'allowance',
        'deductions',
        'net_salary',
        'payroll_date',
    ];

    /**
     * Get the employee profile associated with this payout event log.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}