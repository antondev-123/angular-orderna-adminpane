import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { User } from '../../../../model/user';
import { take } from 'rxjs';
import { UsersApiService } from '../../../../services/users/users-api.service';

@Component({
  selector: 'app-modal-user-confirm-bulk-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-confirm-bulk-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class UserConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get usersToDeleteCount() {
    return this.data.usersToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedUsers() {
    return this.data.selectedUsers;
  }

  constructor(
    private dialogRef: MatDialogRef<UserConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private usersService: UsersApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      usersToDeleteCount: number;
      selectAll: boolean;
      selectedUsers: User['id'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    if (this.selectAll) {
      if (this.selectedUsers.length > 0) {
        this.deleteAllUsersExcept();
      } else {
        this.deleteAllUsers();
      }
    } else if (this.selectedUsers.length > 0) {
      this.deleteUsers();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Bulk delete users cancelled.`);
  }

  private deleteUsers() {
    this.usersService
      .deleteUsers(this.selectedUsers)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllUsers() {
    this.usersService
      .deleteAllUsers()
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllUsersExcept() {
    this.usersService
      .deleteAllUsersExcept(this.selectedUsers)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(`${this.usersToDeleteCount} users deleted!`);
    this.reset();
  }

  private handleError(err: any) {
    this.success = false;
    this.errorMessage = (err as Error).message;
    this.reset();
  }

  private reset(): void {
    // Reset loading states
    this.loading = false;
    this.loaderService.setLoading(false);

    // Allow user to close dialog
    this.dialogRef.disableClose = false;
  }
}
