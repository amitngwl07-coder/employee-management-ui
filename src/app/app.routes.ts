
import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Employees } from './features/employees/employees';
import { EmployeeForm } from './features/employee-form/employee-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'employees/new',
    component: EmployeeForm,
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeForm,
  },
  {
    path: 'employees',
    component: Employees,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
