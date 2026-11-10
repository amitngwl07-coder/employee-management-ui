
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../employees/employee.service';
import { CreateEmployeeRequest } from '../../models/employee';

type EmployeeFormField =
  | 'name'
  | 'email'
  | 'department'
  | 'joiningDate'
  | 'status';

interface BackendErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  protected isLoading = false;
  protected isEditMode = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected backendFieldErrors: Partial<Record<EmployeeFormField, string>> = {};

  private employeeId: number | null = null;

  protected employeeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required],
    joiningDate: [new Date().toISOString().slice(0, 10), Validators.required],
    status: ['ACTIVE' as 'ACTIVE' | 'INACTIVE', Validators.required],
  });

  ngOnInit(): void {
    // Clear backend errors when the user changes a field.
    const fields: EmployeeFormField[] = [
      'name',
      'email',
      'department',
      'joiningDate',
      'status',
    ];

    fields.forEach((field) => {
      this.employeeForm.controls[field].valueChanges.subscribe(() => {
        this.clearBackendFieldError(field);
      });
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.employeeId = Number(id);
      this.loadEmployee(this.employeeId);
    }
  }

  // GET employee by ID
  private loadEmployee(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          joiningDate: employee.joiningDate ?? '',
          status: employee.status ?? 'ACTIVE',
        });

        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Error fetching employee:', error);

        this.errorMessage = this.employeeService.getErrorMessage(error);

        this.isLoading = false;
      },
    });
  }

  // Create or update employee
  protected onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.backendFieldErrors = {};

    const request: CreateEmployeeRequest = this.employeeForm.getRawValue();

    const request$ = this.isEditMode && this.employeeId !== null
      ? this.employeeService.updateEmployee(this.employeeId, request)
      : this.employeeService.createEmployee(request);

    request$.subscribe({
      next: (response) => {
        console.log('Employee saved successfully:', response);

        this.isLoading = false;

        this.successMessage = this.isEditMode
          ? 'Employee updated successfully!'
          : 'Employee created successfully!';

        this.router.navigate(['/employees']);
      },
      error: (error: unknown) => {
        const hasFieldErrors = this.handleBackendErrors(error);

        if (!hasFieldErrors) {
          this.errorMessage = this.employeeService.getErrorMessage(error);
        }

        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Read validation errors returned by Spring Boot.
  private handleBackendErrors(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return false;
    }

    const response = error.error as BackendErrorResponse | null;

    if (!response || typeof response !== 'object') {
      return false;
    }

    // Handle duplicate email or other business errors.
    if (response.message) {
      if (
        response.message.toLowerCase().includes('email') &&
        response.message.toLowerCase().includes('exist')
      ) {
        this.backendFieldErrors.email = response.message;
        return true;
      }

      this.errorMessage = response.message;
      return true;
    }

    // Handle validation errors (HTTP 400).
    if (response.errors) {
      let hasFieldErrors = false;

      Object.entries(response.errors).forEach(([field, message]) => {
        if (
          typeof message === 'string' &&
          Object.prototype.hasOwnProperty.call(
            this.employeeForm.controls,
            field
          )
        ) {
          this.backendFieldErrors[field as EmployeeFormField] = message;
          hasFieldErrors = true;
        }
      });

      return hasFieldErrors;
    }

    return false;
  }

  // Clear backend validation error when a field changes.
  protected clearBackendFieldError(field: EmployeeFormField): void {
    delete this.backendFieldErrors[field];
  }
}
