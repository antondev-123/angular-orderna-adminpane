import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, output, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, ButtonTextDirective } from '../../button/button.component';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  imports: [
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  styleUrls: ['../modal.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationDialogComponent {
  loading = signal(false);

  #dialogRef = inject(MatDialogRef);
  message = inject(MAT_DIALOG_DATA) as string;

  deleteConfirmed = output<void>();

  closeDialog(): void {
    this.#dialogRef.close();
  }

  confirmDelete(): void {
    this.loading.set(true);
    this.deleteConfirmed.emit();
  }
}
