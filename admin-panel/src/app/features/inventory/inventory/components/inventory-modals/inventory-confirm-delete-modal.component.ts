import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoaderService } from '../../../../../services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { InventoryItem } from '../../../../../model/inventory';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../../shared/components/button/button.component';
import { InventoryApiService } from '../../../../../services/inventory/inventory-api.service';

@Component({
  selector: 'app-inventory-confirm-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './inventory-confirm-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class InventoryConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get inventory() {
    return this.data.inventory;
  }

  constructor(
    private dialogRef: MatDialogRef<InventoryConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private inventoryService: InventoryApiService,
    @Inject(MAT_DIALOG_DATA) public data: { inventory: Maybe<InventoryItem> }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteInventory();
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Delete inventory cancelled.`);
  }

  private deleteInventory() {
    if (!this.inventory) {
      console.error('No inventory to delete.');
      return;
    }

    const inventoryIdsToDelete  = this.inventory.id;
    this.inventoryService
      .deleteInventoryItems([inventoryIdsToDelete])
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog('inventory deleted!');
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
