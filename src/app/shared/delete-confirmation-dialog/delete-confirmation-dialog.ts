import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>

    <mat-dialog-content>
      Are you sure you want to delete
      <strong>{{ data.employeeName }}</strong>?
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        Cancel
      </button>

      <button mat-flat-button color="warn" (click)="onConfirm()">
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class DeleteConfirmationDialog {

  protected readonly data = inject<{ employeeName: string }>(
    MAT_DIALOG_DATA
  );

  private readonly dialogRef =
    inject(MatDialogRef<DeleteConfirmationDialog, boolean>);

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
}