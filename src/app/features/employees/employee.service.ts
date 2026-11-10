
import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpContext
} from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  EmployeePageResponse,
  CreateEmployeeRequest,
  Employee
} from '../../models/employee';

import { EmployeeStatistics } from '../../models/employee-statistics';

// Adjust this import path to match your interceptor location.
import { SKIP_GLOBAL_ERROR_HANDLING } from '../../interceptors/http-error.interceptor';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/employees`;

  // Skip global Snackbar when the component handles errors inline.
  private readonly formErrorContext = new HttpContext().set(
    SKIP_GLOBAL_ERROR_HANDLING,
    true
  );

  // GET: Fetch employees with pagination, sorting and searching
  getAllEmployees(
    page: number,
    size: number,
    sortBy: string = 'createdOn',
    direction: string = 'desc',
    search: string = '',
    department: string = '',
    status: string = ''
  ): Observable<EmployeePageResponse> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (department) {
      params = params.set('department', department);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<EmployeePageResponse>(
      this.apiUrl,
      { params }
    );
  }

  // POST: Create employee
  createEmployee(request: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(
      this.apiUrl,
      request,
      {
        context: this.formErrorContext
      }
    );
  }

  // GET: Fetch employee by ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(
      `${this.apiUrl}/${id}`,
      {
        context: this.formErrorContext
      }
    );
  }

  // PUT: Update employee
  updateEmployee(
    id: number,
    request: CreateEmployeeRequest
  ): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.apiUrl}/${id}`,
      request,
      {
        context: this.formErrorContext
      }
    );
  }

  // DELETE: Delete employee by ID
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  // GET: Fetch employee dashboard statistics
  getEmployeeStatistics(): Observable<EmployeeStatistics> {
    return this.http.get<EmployeeStatistics>(
      `${this.apiUrl}/statistics`
    );
  }

  // Extract meaningful error messages from Spring Boot responses.
  getErrorMessage(error: unknown): string {

    if (!(error instanceof HttpErrorResponse)) {
      return 'An unexpected error occurred. Please try again.';
    }

    // Prefer the actual backend error message.
    const backendMessage = error.error?.message;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    switch (error.status) {

      case 0:
        return 'Unable to connect to the server. Please check your connection and try again.';

      case 400:
        return 'Invalid request. Please check your input.';

      case 401:
        return 'Your session has expired. Please log in again.';

      case 403:
        return 'You do not have permission to perform this action.';

      case 404:
        return 'The requested resource was not found.';

      case 409:
        return 'This request conflicts with existing data.';

      case 500:
        return 'Something went wrong on the server. Please try again later.';

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
