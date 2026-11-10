
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpContextToken
} from '@angular/common/http';

import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const SKIP_GLOBAL_ERROR_HANDLING =
  new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: req.url,
      });

      // Skip global notification when component handles the error.
      if (req.context.get(SKIP_GLOBAL_ERROR_HANDLING)) {
        return throwError(() => error);
      }

      let errorMessage = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'Requested resource was not found.';
            break;
          case 409:
            errorMessage = 'Conflict detected. The requested operation cannot be completed.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
        }
      }

      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      return throwError(() => error);
    })
  );
};
