import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ICustomer } from '@orderna/admin-panel/src/app/model/customer';
import { CustomersApiService } from '@orderna/admin-panel/src/app/services/customers/customers-api.service';
import { debounceTime, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-customer-details-dialog',
  templateUrl: './customer-details-dialog.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatIcon],
})
export class CustomerDetailsDialogComponent {
  addCustomer = output<void>();
  #dialogRef = inject(MatDialogRef);

  #customersService = inject(CustomersApiService);

  searchQuery = signal('');
  selectedCustomer = signal<ICustomer | undefined>(undefined);

  customer = inject(MAT_DIALOG_DATA) as ICustomer;

  constructor() {
    if (this.customer) {
      this.selectedCustomer.set(this.customer);
    }
  }

  customers = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(500),
      switchMap((query) => {
        if (query === '') {
          return this.customer ? of([this.customer]) : of([]);
        }

        return this.#customersService.getCustomers({
          page: 1,
          perPage: 3,
          searchQuery: query,
        });
      }),
      startWith(this.customer ? [this.customer] : [])
    )
  );

  apply(): void {
    this.#dialogRef.close(this.selectedCustomer());
  }

  close(): void {
    this.#dialogRef.close();
  }
}
