import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { LoaderService } from '../../../../services/shared/loader/loader.service';
import { Store } from '../../../../model/store';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-store-confirm-close-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  templateUrl: './store-confirm-close-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
    './store-confirm-close-modal.component.scss',
  ],
})
export class StoreConfirmCloseModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get store() {
    return this.data.store;
  }

  constructor(
    private dialogRef: MatDialogRef<StoreConfirmCloseModalComponent>,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      store: Store;
      storeId: number;
      categoryId: number;
    }
  ) {}
  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    this.closeStore();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ? result : undefined);
  }

  private closeStore() {
    if (!this.store) {
      console.error('No store to close.');
      return;
    }

    this.handleSuccess(true);
  }

  private handleSuccess(result: any) {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(result);
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
