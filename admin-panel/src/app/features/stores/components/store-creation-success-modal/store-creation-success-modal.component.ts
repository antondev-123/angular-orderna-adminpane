import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../../shared/components/button/button.component';
import { Store } from '../../../../model/store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-store-creation-success-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ButtonComponent,
    ButtonTextDirective,
  ],
  templateUrl: './store-creation-success-modal.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
    './store-creation-success-modal.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StoreCreationSuccessModalComponent {
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<StoreCreationSuccessModalComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      storeName: Store['name'];
    }
  ) {}

  handleContinueClicked() {
    this.router.navigate(['stores']);
    this.dialogRef.close();
  }
}
