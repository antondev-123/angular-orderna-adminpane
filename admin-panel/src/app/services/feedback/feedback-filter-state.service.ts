import { Injectable, OnDestroy } from '@angular/core';
import { IStore } from '../../model/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FlatPickrOutputOptions } from 'angularx-flatpickr/lib/flatpickr.directive';
import { DateGroup } from '../../../types/date-group';
import { IFeedbackFilterState } from '../../model/feedback';
import { StoresApiService } from '../../core/stores/stores-api.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackFilterStateService implements OnDestroy {
  filterState$ = new BehaviorSubject<IFeedbackFilterState>({
    isLoading: true,
    storeFilterOptions: [],
  });

  filterStateSubscription!: Subscription;

  constructor(private storesService: StoresApiService) {
    this.filterStateSubscription = this.storesService
      .getStoreNames()
      .subscribe((stores) => {
        const storeFilterOptions = (stores ?? []).map((store) => ({
          label: store.name,
          value: store.id,
        }));
        this.filterState$.next({
          isLoading: false,
          storeFilterOptions: [
            { label: 'Select store', value: 'empty' },
            ...storeFilterOptions,
          ],
        });
      });
  }

  ngOnDestroy() {
    this.filterStateSubscription.unsubscribe();
  }

  handleDateRangeChange(args: Partial<FlatPickrOutputOptions>): void {
    this.filterState$.next({
      ...this.filterState$.value,
      dateRangeFilter: {
        from: args.selectedDates ? args.selectedDates[0] : undefined,
        to: args.selectedDates ? args.selectedDates[1] : undefined,
      },
    });
  }

  handleStoreFilter(filter?: IStore['id'] | 'empty') {
    this.filterState$.next({
      ...this.filterState$.value,
      storeId: filter,
    });
  }

  handleGroupFilter(dateGroup: DateGroup) {
    this.filterState$.next({
      ...this.filterState$.value,
      dateGroup,
    });
  }
}
