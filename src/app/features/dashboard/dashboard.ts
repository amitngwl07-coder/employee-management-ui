import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { EmployeeService } from '../employees/employee.service';
import { Employee } from '../../models/employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  protected recentEmployees: Employee[] = [];

  protected isLoadingRecentEmployees = true;
  protected isLoadingStatistics = true;

  protected recentEmployeesError = '';
  protected statisticsError = '';

  protected readonly stats = [
    {
      title: 'Total Employees',
      value: 0,
      description: 'All registered employees',
      icon: 'users',
      color: 'blue',
    },
    {
      title: 'Active Employees',
      value: 0,
      description: 'Currently active employees',
      icon: 'user-check',
      color: 'green',
    },
    {
      title: 'Inactive Employees',
      value: 0,
      description: 'Currently inactive employees',
      icon: 'user-x',
      color: 'orange',
    },
  ];

  ngOnInit(): void {
    this.loadEmployeeStatistics();
    this.loadRecentEmployees();
  }

  // GET recent employees
  private loadRecentEmployees(): void {
    this.isLoadingRecentEmployees = true;
    this.recentEmployeesError = '';

    this.employeeService.getAllEmployees(0, 4).subscribe({
      next: (response) => {
        this.recentEmployees = response.listResult;
        this.isLoadingRecentEmployees = false;

        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Failed to load recent employees:', error);

        this.recentEmployeesError =
          this.employeeService.getErrorMessage(error);

        this.recentEmployees = [];
        this.isLoadingRecentEmployees = false;

        this.cdr.markForCheck();
      },
    });
  }

  // Navigate to employee list
  protected navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  // GET employee statistics
  private loadEmployeeStatistics(): void {
    this.isLoadingStatistics = true;
    this.statisticsError = '';

    this.employeeService.getEmployeeStatistics().subscribe({
      next: (statistics) => {
        this.stats[0].value = statistics.totalEmployees;
        this.stats[1].value = statistics.activeEmployees;
        this.stats[2].value = statistics.inactiveEmployees;

        this.isLoadingStatistics = false;

        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Failed to load employee statistics:', error);

        this.statisticsError =
          this.employeeService.getErrorMessage(error);

        this.stats.forEach(stat => stat.value = 0);

        this.isLoadingStatistics = false;

        this.cdr.markForCheck();
      },
    });
  }

}