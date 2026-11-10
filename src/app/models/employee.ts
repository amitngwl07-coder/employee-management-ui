export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
    id: number;
    employeeCode: string | null;
    name: string;
    email: string;
    department: string;
    joiningDate: string | null;
    status: EmployeeStatus | null;
    createdOn: string | null;
}

export interface EmployeePageResponse {
    listResult: Employee[];
    totalResult: number;
}

export interface CreateEmployeeRequest {
    name: string;
    email: string;
    department: string;
    joiningDate?: string;
    status?: EmployeeStatus;
}