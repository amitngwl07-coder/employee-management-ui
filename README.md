# Employee Management System – Angular Frontend

A responsive Employee Management System built using **Angular 22** and **Angular Material**. This application provides an intuitive interface for managing employee records, monitoring workforce statistics, and performing employee-related operations.

## 🚀 Project Overview

The Employee Management System is designed to simplify employee record management through a clean dashboard and an interactive user interface.

It communicates with a Spring Boot REST API to perform CRUD operations and retrieve employee statistics.

## ✨ Features

- **Dashboard:** View total employees, active employees, inactive employees, and recently added employees.
- **Employee Management:** Add, view, update, and delete employee records.
- **Search:** Search employees by employee code, name, email, and department.
- **Pagination:** Navigate employee records with configurable page sizes.
- **Sorting:** Sort employee records by different table columns.
- **Filtering:** Filter employees by department and employment status.
- **Form Validation:** Validate employee information before submission.
- **Error Handling:** Display meaningful API error messages and notifications.
- **Responsive Design:** User-friendly interface across desktop and mobile devices.
- **Confirmation Dialog:** Confirm before deleting employee records.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Angular 22 | Frontend framework |
| TypeScript | Programming language |
| Angular Material | UI components |
| SCSS | Styling |
| RxJS | Reactive programming |
| HTML5 | Application structure |
| CSS3 | Responsive styling |
| REST API | Backend communication |

## 📸 Screenshots

Screenshots of the application will be added here.

- Dashboard
- Employee Listing
- Add Employee
- Edit Employee
- Delete Confirmation

## 📂 Project Structure

```text
src/
├── app/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   └── employee-form/
│   ├── layout/
│   │   ├── header/
│   │   └── sidebar/
│   ├── shared/
│   │   └── delete-confirmation-dialog/
│   ├── models/
│   └── services/
├── environments/
└── styles.scss
```

## ⚙️ Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Angular CLI 22
- Git
- Running Spring Boot backend
- MySQL database configured for the backend

## 💻 Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/amitngwl07-coder/employee-management-ui.git
```

**2. Navigate to the project directory**

```bash
cd employee-management-ui
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure the backend API URL**

Configure the backend API base URL in the Angular environment configuration.

For local development, use:

```text
http://localhost:8080/api/employees
```

Make sure the Spring Boot backend is running and accessible.

**5. Start the development server**

```bash
ng serve
```

Open your browser:

```text
http://localhost:4200/
```

## 🏗️ Production Build

To create an optimized production build:

```bash
ng build --configuration production
```

The generated build files will be available in the `dist/` directory.

## 🧪 Testing

Run unit tests using:

```bash
ng test
```

## 🔗 Related Repository

**Spring Boot Backend:**

https://github.com/amitngwl07-coder/employee-management-system-backend

## 👨‍💻 Developer

Developed as a full-stack portfolio project to demonstrate practical Angular frontend development and REST API integration skills.