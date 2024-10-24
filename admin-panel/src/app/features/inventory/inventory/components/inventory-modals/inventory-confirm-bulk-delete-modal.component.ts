import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoaderService } from '../../../../../services/shared/loader/loader.service';
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
  selector: 'app-inventory-confirm-bulk-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './inventory-confirm-bulk-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class InventoryConfirmBulkDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get inventorysToDeleteCount() {
    return this.data.inventorysToDeleteCount;
  }

  get selectAll() {
    return this.data.selectAll;
  }

  get selectedInventorys() {
    return this.data.selectedInventorys;
  }

  constructor(
    private dialogRef: MatDialogRef<InventoryConfirmBulkDeleteModalComponent>,
    private loaderService: LoaderService,
    private inventoryService: InventoryApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      inventorysToDeleteCount: number;
      selectAll: boolean;
      selectedInventorys: InventoryItem['id'][];
    }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;
    console.log('count', this.selectedInventorys);

    if (this.selectAll) {
      this.deleteInventorys();
    } else if (this.selectedInventorys.length > 0) {
      this.deleteInventorys();
    }
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result ?? `Bulk delete users cancelled.`);
  }

  private deleteInventorys() {
    this.inventoryService
      .deleteInventoryItems(this.selectedInventorys)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllInventorys() {
    this.inventoryService
      .deleteAllInventoryItems()
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private deleteAllInventorysExcept() {
    this.inventoryService
      .deleteAllInventoryItemsExcept(this.selectedInventorys)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(`${this.inventorysToDeleteCount} Inventorys deleted!`);
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
