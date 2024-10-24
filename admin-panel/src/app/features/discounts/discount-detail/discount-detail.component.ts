import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { DateAgoPipe } from '../../../common/pipes/date-ago/date-ago.pipe';
import { DiscountDetail, DiscountStatistics } from '../../../model/discount';
import { DiscountStatisticsComponent } from '../components/discount-statistics/discount-statistics.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { DiscountStatisticsSkeletonComponent } from '../components/discount-statistics-skeleton/discount-statistics-skeleton.component';
import { DiscountsApiService } from '../../../services/discounts/discounts-api.service';
import { DiscountTotalRedeemedOverTimeChartComponent } from '../components/discount-total-redeemed-over-time-chart/discount-total-redeemed-over-time-chart.component';
import { DiscountTotalRedeemedOverTimeChartSkeletonComponent } from '../components/discount-total-redeemed-over-time-chart-skeleton/discount-total-redeemed-over-time-chart-skeleton.component';
import { combineLatest, map, Observable } from 'rxjs';

interface PageData {
  discount: DiscountDetail;
  totalRedeemedAmountOverTimeChartData: {
    data: number[];
    labels: Date[];
  };
}

@Component({
  selector: 'app-discount-detail',
  standalone: true,
  imports: [
    CommonModule,

    DateAgoPipe,
    BadgeComponent,
    SkeletonComponent,
    BackButtonComponent,

    DiscountStatisticsComponent,
    DiscountStatisticsSkeletonComponent,
    DiscountTotalRedeemedOverTimeChartComponent,
    DiscountTotalRedeemedOverTimeChartSkeletonComponent,
  ],
  templateUrl: './discount-detail.component.html',
  styleUrl: './discount-detail.component.css',
})
export class DiscountDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  discountsService = inject(DiscountsApiService);

  // TODO: Move to a separate component
  // Props for revenue over time card
  initialStartDate: Date = new Date();
  initialEndDate: Date = new Date();

  customPresets = [
    'Today',
    'Yesterday',
    'This month',
    'Last month',
    'This year',
    'Last year',
    'All time',
  ];

  discount$ = this.discountsService.getDiscount(this.discountId);
  discountTotalRedeemedAmountOverTimeChartData$ =
    this.discountsService.getDiscountTotalRedeemedAmountOverTimeChartData(
      this.discountId
    );
  data$: Observable<PageData> = combineLatest([
    this.discount$,
    this.discountTotalRedeemedAmountOverTimeChartData$,
  ]).pipe(
    map(([discount, discountTotalRedeemedAmountOverTimeChartData]) => {
      return {
        discount: discount ?? new DiscountDetail(),
        totalRedeemedAmountOverTimeChartData: {
          data: discountTotalRedeemedAmountOverTimeChartData.map(
            (o) => o.totalRedeemedAmount
          ),
          labels: discountTotalRedeemedAmountOverTimeChartData.map(
            (o) => o.period
          ),
        },
      };
    })
  );

  // TODO: Get data from service
  statistics = new DiscountStatistics();

  get discountId() {
    return +this.route.snapshot.params['discountId'];
  }

  goToDiscountsPage() {
    this.router.navigate(['discounts'], { queryParamsHandling: 'merge' });
  }
}
