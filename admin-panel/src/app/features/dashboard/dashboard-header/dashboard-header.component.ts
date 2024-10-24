import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { IStore } from '../../../model/store';
import { InputFilterImmediateComponent } from '../../../shared/components/input/filter-immediate/filter-immediate.component';
import { FilterOptionItem } from '../../../../types/filter';
import { InputDateRangeComponent } from '../../../shared/components/input/daterange/daterange.component';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { DateFilter } from '../../../../types/date-filter';
import { StoresApiService } from '../../../core/stores/stores-api.service';

export interface IDashboardFilter {
  storeId: IStore['id'] | 'empty';
  startDate: Date;
  endDate: Date;
  dateFilter?: DateFilter;
}

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [
    InputFilterImmediateComponent,
    InputDateRangeComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
})
export class DashboardHeaderComponent implements OnInit {
  @Output() filterChange = new EventEmitter<IDashboardFilter>();

  stores: FilterOptionItem<IStore['id'] | 'empty'>[] = [];
  storesService = inject(StoresApiService);

  filter: IDashboardFilter = {
    storeId: 'empty',
    startDate: new Date(),
    endDate: new Date(),
  };

  dateFilter = Object.keys(DateFilter) as DateFilter[];

  selectedDateFilter?: DateFilter = undefined;

  customPresets = [
    'Today',
    'Yesterday',
    'This month',
    'Last month',
    'This year',
    'Last year',
  ];

  ngOnInit(): void {
    this.storesService.getStoreNames().subscribe({
      next: (data:any) => {
        const storeFilterOptions = (data.data ?? []).map((store:any) => ({
          label: store.name,
          value: store.id,
        }));
        this.stores = [
          { label: 'Select store', value: 'empty' },
          ...storeFilterOptions,
        ];
      },
    });
  }

  handleStoreFilter(event: number | 'empty') {
    const selectedStore = event as IStore['id'] | 'empty';
    this.filter = { ...this.filter, storeId: selectedStore };
    this.filterChange.emit(this.filter);
  }

  handleDateFilter(event: string) {
    const selectedDates = event.split('_');
    this.filter = {
      ...this.filter,
      startDate: new Date(selectedDates[0]),
      endDate: new Date(selectedDates[1]),
    };
    this.filterChange.emit(this.filter);
  }

  capitalizeFirstLetter(string: String) {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleFilter(filter: DateFilter) {
    this.selectedDateFilter =
      !this.selectedDateFilter || this.selectedDateFilter !== filter
        ? filter
        : undefined;
    this.filter = {
      ...this.filter,
      dateFilter: this.selectedDateFilter,
    };
    this.filterChange.emit(this.filter);
  }
}
