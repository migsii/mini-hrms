<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salary extends Model
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
    ];

    /**
     * Get the employee that owns the salary configuration.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}