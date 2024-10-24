import { Component, Input, OnInit } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { DashboardOverviewChangeComponent } from './dashboard-overview-change/dashboard-overview-change.component';
import { BehaviorSubject, Observable, catchError, map, merge, of } from 'rxjs';
import { IDashboardFilter } from '../dashboard-header/dashboard-header.component';
import { IStoreDashboardSummary } from '../../../model/store';
import { CommonModule } from '@angular/common';
import { StoresApiService } from '../../../core/stores/stores-api.service';

export interface OverviewData {
  isLoading: boolean;
  summaryData: IStoreDashboardSummary[];
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    DashboardOverviewChangeComponent,
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css',
})
export class DashboardOverviewComponent implements OnInit {
  @Input() dashboardFilter!: BehaviorSubject<IDashboardFilter>;

  data$!: Observable<OverviewData>;

  errorMessage?: string;

  constructor(private storesService: StoresApiService) {}

  ngOnInit(): void {
    const behaviourSubjects = merge(this.dashboardFilter);

    behaviourSubjects.subscribe((_) => {
      this.errorMessage = undefined;

      this.data$ = of({
        isLoading: true,
        summaryData: [],
      });

      if (
        this.dashboardFilter.value?.storeId === 'empty' ||
        this.dashboardFilter.value?.storeId === null
      ) {
        this.data$ = of({
          isLoading: false,
          summaryData: [],
        });
        return;
      }
      this.data$ = this.storesService
        .getStoreSummaryData(this.dashboardFilter.value)
        .pipe(
          map((summaryData) => {
            return {
              isLoading: false,
              summaryData: summaryData || [],
            };
          }),
          catchError((error) => {
            this.errorMessage = error.message;
            return of({
              isLoading: false,
              summaryData: [],
            });
          })
        );
    });
  }
}
