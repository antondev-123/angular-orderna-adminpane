import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@orderna/admin-panel/src/app/shared/components/button/button.component';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  imports: [ButtonComponent, MatDialogModule, MatIconModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
})
export class OrderCompleteComponent {
  #matDialogRef = inject(MatDialogRef);

  close(): void {
    this.#matDialogRef.close();
  }
}
