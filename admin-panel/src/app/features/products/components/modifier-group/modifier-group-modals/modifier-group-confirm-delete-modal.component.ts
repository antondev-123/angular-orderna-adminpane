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
} from '../../../../../shared/components/button/button.component';
import { LoaderService } from '../../../../../services/shared/loader/loader.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { take } from 'rxjs';
import { ModifierGroup } from '../../../../../model/modifier-group';
import { ProductsApiService } from '../../../../../services/products/products-api.service';

@Component({
  selector: 'app-modal-modifier-group-confirm-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modifier-group-confirm-delete-modal.component.html',
  styleUrl: '/admin-panel/src/app/shared/components/modal/modal.component.scss',
})
export class ModifierGroupConfirmDeleteModalComponent {
  loading: boolean = false;
  success: boolean = false;

  errorMessage: string = '';

  get modifierGroup() {
    return this.data.modifierGroup;
  }

  constructor(
    private dialogRef: MatDialogRef<ModifierGroupConfirmDeleteModalComponent>,
    private loaderService: LoaderService,
    private productsService: ProductsApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: { modifierGroup: Maybe<ModifierGroup> }
  ) {}

  handleSubmit() {
    this.loaderService.setLoading(true);
    this.loading = true;

    // Prevent user from closing dialog
    this.dialogRef.disableClose = true;

    this.deleteModifierGroup();
  }

  closeDialog(result: boolean = false) {
    this.dialogRef.close(result);
  }

  private deleteModifierGroup() {
    if (!this.modifierGroup) {
      console.error('No modifier group to delete.');
      return;
    }

    this.productsService
      .deleteModifierGroup(this.modifierGroup.id)
      .pipe(take(1))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess() {
    this.success = true;
    this.errorMessage = '';
    this.closeDialog(true);
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
