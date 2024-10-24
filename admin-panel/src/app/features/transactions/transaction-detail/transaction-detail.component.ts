import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '../../../shared/components/button/back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { CapitalizePipe } from '../../../common/pipes/capitalize/capitalize.pipe';
import { MatIconModule } from '@angular/material/icon';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, switchMap, takeUntil, tap } from 'rxjs';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { range } from '@orderna/admin-panel/src/utils/range';
import { TransactionsApiService } from '../../../services/transactions/transactions-api.service';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-discount-detail',
  standalone: true,
  imports: [
    CommonModule,
    CapitalizePipe,
    BackButtonComponent,
    SkeletonComponent,
    MatIconModule,
    BadgeComponent,
  ],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDetailComponent extends SubscriptionManager {
  range = range;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  transactionsService = inject(TransactionsApiService);
  isMediumOrSmaller = signal<boolean>(false);
  scrollTop = 0;

  asidePanelElement = viewChild<ElementRef>('asidePanel');

  data$ = this.transactionsService.getTransaction(this.transactionId);
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

  constructor(
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

  get transactionId() {
    return this.route.snapshot.params['transactionId'];
  }

  goToTransactionsPage() {
    this.router.navigate(['transactions'], { queryParamsHandling: 'merge' });
  }
}
