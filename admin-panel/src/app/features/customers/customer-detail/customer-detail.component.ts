import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  viewChild,
  ElementRef,
  inject,
  signal,
  Renderer2,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import {
  QueryOptions,
  toQueryOptions,
} from '@orderna/admin-panel/src/types/query-options';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import {
  filter,
  switchMap,
  tap,
  Observable,
  startWith,
  combineLatest,
  map,
  takeUntil,
} from 'rxjs';
import { DateAgoPipe } from '../../../common/pipes/date-ago/date-ago.pipe';
import { Category } from '../../../model/category';
import { Customer } from '../../../model/customer';
import { Product } from '../../../model/product';
import { Transaction, ITransaction } from '../../../model/transaction';
import { CustomersApiService } from '../../../services/customers/customers-api.service';
import { TransactionsApiService } from '../../../services/transactions/transactions-api.service';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { CustomerStatisticsSkeletonComponent } from '../components/customer-statistics-skeleton/customer-statistics-skeleton.component';
import { CustomerStatisticsComponent } from '../components/customer-statistics/customer-statistics.component';
import { CustomerTopRecentProductsSkeletonComponent } from '../components/customer-top-recent-products-skeleton/customer-top-recent-products-skeleton.component';
import { CustomerTopRecentProductsComponent } from '../components/customer-top-recent-products/customer-top-recent-products.component';
import { CustomerTransactionsByCategoryChartSkeletonComponent } from '../components/customer-transactions-by-category-chart-skeleton/customer-transactions-by-category-chart-skeleton.component';
import { CustomerTransactionsByCategoryChartComponent } from '../components/customer-transactions-by-category-chart/customer-transactions-by-category-chart.component';
import { CustomerTransactionsTimelineSkeletonComponent } from '../components/customer-transactions-timeline-skeleton/customer-transactions-timeline-skeleton.component';
import { CustomerTransactionsTimelineComponent } from '../components/customer-transactions-timeline/customer-transactions-timeline.component';

interface PageData {
  customer: Maybe<Customer>;
  transactions: Maybe<Transaction[]>;
  transactionCountsByCategoryChartData: Maybe<{
    labels: Category['name'][];
    series: number[];
  }>;
  topRecentProducts: Maybe<Product['title'][]>;
}

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    DateAgoPipe,
    MatIconModule,
    MatExpansionModule,
    SkeletonComponent,
    BackButtonComponent,
    CustomerStatisticsComponent,
    CustomerStatisticsSkeletonComponent,
    CustomerTransactionsTimelineComponent,
    CustomerTransactionsTimelineSkeletonComponent,
    CustomerTransactionsByCategoryChartComponent,
    CustomerTransactionsByCategoryChartSkeletonComponent,
    CustomerTopRecentProductsComponent,
    CustomerTopRecentProductsSkeletonComponent,
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailComponent
  extends SubscriptionManager
  implements OnInit
{
  activityPanelElement = viewChild<MatExpansionPanel>('activityPanel');
  asidePanelElement = viewChild<ElementRef>('asidePanel');

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  scrollDispatcher = inject(ScrollDispatcher);

  asidePanel$ = toObservable(this.asidePanelElement);
  scrollEvent$ = this.asidePanel$.pipe(
    filter((element): element is ElementRef => element instanceof ElementRef),
    switchMap((element) => this.scrollDispatcher.ancestorScrolled(element, 10)),
    filter(
      (cdkScrollable): cdkScrollable is CdkScrollable =>
        cdkScrollable instanceof CdkScrollable
    ),
    tap((scrollable) => {
      this.scrollTop = scrollable.measureScrollOffset('top');
      this.fixAsidePanelToTop();
    })
  );
  scrollEvent = toSignal(this.scrollEvent$);

  isMediumOrSmaller = signal<boolean>(false);
  scrollTop = 0;

  fallbackQueryOptions: QueryOptions<ITransaction> = {
    page: 1,
    perPage: 10,
    sort: { field: 'transactionDate', direction: 'desc' },
  };

  data$: Observable<PageData> = this.route.queryParams.pipe(
    switchMap((params: Params) => {
      const { queryOptions, error } = toQueryOptions(
        params,
        this.fallbackQueryOptions
      );

      if (queryOptions === null) {
        // TODO: Handle error
        console.log(error);
        throw error;
      }

      const customer$ = this.customersService
        .getCustomer(this.customerId)
        .pipe(startWith(null));
      const transactions$ = this.transactionsService
        .getCustomerTransactions(this.customerId, queryOptions)
        .pipe(startWith(null));
      const transactionCountsByCategory$ = this.transactionsService
        .getCustomerTransactionCountsByCategory(this.customerId, queryOptions)
        .pipe(startWith(null));
      const topRecentProducts$ = this.transactionsService
        .getCustomerTopRecentProducts(this.customerId, queryOptions)
        .pipe(startWith(null));

      return combineLatest([
        customer$,
        transactions$,
        transactionCountsByCategory$,
        topRecentProducts$,
      ]).pipe(
        map(
          ([
            customer,
            transactions,
            transactionCountsByCategory,
            topRecentProducts,
          ]) => ({
            customer,
            transactions,
            ...(transactionCountsByCategory
              ? {
                  transactionCountsByCategoryChartData: {
                    labels: Object.keys(transactionCountsByCategory),
                    series: Object.values(transactionCountsByCategory),
                  },
                }
              : { transactionCountsByCategoryChartData: null }),
            topRecentProducts,
          })
        )
      );
    })
  );

  get customerId() {
    return +this.route.snapshot.params['customerId'];
  }

  constructor(
    private transactionsService: TransactionsApiService,
    private customersService: CustomersApiService,
    private responsive: BreakpointObserver,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit() {
    this.responsive
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.isMediumOrSmaller.set(result.matches);
        this.handleExpansionPanelState();
        this.fixAsidePanelToTop();
      });
  }

  fixAsidePanelToTop(): void {
    const asidePanelElement = this.asidePanelElement()?.nativeElement;
    if (!asidePanelElement) return;
    const scrollTop = this.scrollTop;
    const offsetTop = -80; //px
    if (this.isMediumOrSmaller() || scrollTop <= -offsetTop) {
      this.renderer.setStyle(asidePanelElement, 'marginTop', '0px');
    } else {
      this.renderer.setStyle(
        asidePanelElement,
        'marginTop',
        `${scrollTop + offsetTop}px`
      );
    }
  }

  handleExpansionPanelState(): void {
    const activityPanelElement = this.activityPanelElement();
    if (!activityPanelElement) return;
    if (!this.isMediumOrSmaller()) {
      activityPanelElement.open();
    } else if (this.isMediumOrSmaller() && activityPanelElement.expanded) {
      activityPanelElement.close();
    }
  }

  goToCustomersPage() {
    this.router.navigate(['customers'], { queryParamsHandling: 'merge' });
  }
}
