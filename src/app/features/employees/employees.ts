
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { EmployeeService } from './employee.service';
import { Employee } from '../../models/employee';
import { DeleteConfirmationDialog } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-employees',
  imports: [
    RouterLink,
    MatIconModule,
    DatePipe,
    MatPaginatorModule
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  protected employees: Employee[] = [];
  protected totalEmployees = 0;
  protected searchTerm = '';
  protected isLoading = false;
  protected errorMessage = '';
  protected deletingEmployeeId: number | null = null;

  protected pageIndex = 0;
  protected pageSize = 10;
  protected pageSizeOptions = [5, 10, 20];

  protected sortBy = 'createdOn';
  protected sortDirection: 'asc' | 'desc' = 'desc';

  protected selectedDepartment = '';
  protected selectedStatus = '';

  protected departmentOptions = [
    { label: 'All Departments', value: '' },
    { label: 'IT', value: 'IT' },
    { label: 'HR', value: 'HR' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Operations', value: 'Operations' }
  ];

  protected statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  ngOnInit(): void {

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),

      switchMap(() => {

        this.isLoading = true;
        this.errorMessage = '';

        return this.employeeService.getAllEmployees(
          this.pageIndex,
          this.pageSize,
          this.sortBy,
          this.sortDirection,
          this.searchTerm.trim(),
          this.selectedDepartment,
          this.selectedStatus
        ).pipe(
          catchError((error: unknown) => {

            console.error('Error searching employees:', error);

            this.errorMessage =
              this.employeeService.getErrorMessage(error);

            this.employees = [];
            this.totalEmployees = 0;
            this.isLoading = false;

            this.cdr.markForCheck();

            return EMPTY;
          })
        );
      }),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe(response => {

      this.employees = response.listResult;
      this.totalEmployees = response.totalResult;
      this.isLoading = false;

      this.cdr.markForCheck();
    });

    this.loadEmployees();
  }

  // GET employees with pagination, sorting and filters
  private loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getAllEmployees(
      this.pageIndex,
      this.pageSize,
      this.sortBy,
      this.sortDirection,
      this.searchTerm.trim(),
      this.selectedDepartment,
      this.selectedStatus
    ).subscribe({
      next: (response) => {
        this.employees = response.listResult;
        this.totalEmployees = response.totalResult;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Error fetching employees:', error);

        this.errorMessage = this.employeeService.getErrorMessage(error);
        this.employees = [];
        this.totalEmployees = 0;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
    });
  }

  // Retry employee API request
  protected onRetry(): void {
    this.loadEmployees();
  }

  // Clear all filters
  protected onClearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.pageIndex = 0;

    this.loadEmployees();
  }

  // Filter by department
  protected onDepartmentChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedDepartment = select.value;
    this.pageIndex = 0;

    this.loadEmployees();
  }

  // Filter by status
  protected onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedStatus = select.value;
    this.pageIndex = 0;

    this.loadEmployees();
  }

  // Sort employees
  protected onSort(column: string): void {

    if (this.sortBy === column) {
      this.sortDirection =
        this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    this.pageIndex = 0;
    this.loadEmployees();
  }

  // Search employees
  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm = input.value;
    this.pageIndex = 0;

    this.searchSubject.next(this.searchTerm.trim());
  }

  // DELETE employee
  protected onDelete(employee: Employee): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '400px',
      data: {
        employeeName: employee.name,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) {
        return;
      }

      this.deletingEmployeeId = employee.id;
      this.errorMessage = '';

      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.employees = this.employees.filter(
            emp => emp.id !== employee.id
          );

          this.totalEmployees--;

          this.deletingEmployeeId = null;
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.error('Error deleting employee:', error);

          this.errorMessage = this.employeeService.getErrorMessage(error);
          this.deletingEmployeeId = null;

          this.cdr.markForCheck();
        },
      });
    });
  }

  // Handle pagination
  protected onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadEmployees();
  }

  // Count departments on the current page
  protected getDepartmentCount(): number {
    return new Set(
      this.employees.map(employee => employee.department)
    ).size;
  }
}
