import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSidenav,
  MatSidenavContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  BreakpointObserver,
  Breakpoints,
  MediaMatcher,
} from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { filter, map, takeUntil } from 'rxjs';
import { SIDE_MENU } from '../../data/side-menu';
import { MenuItem } from '../../model/menu-item';
import { SidebarService } from '../../services/shared/sidebar/sidebar.service';
import { SelectedStoreService } from '../../services/shared/selected-store/selected-store.service';
import { OrderService } from '../../services/shared/order/order.service';
import { StoresApiService } from '../../core/stores/stores-api.service';
import { AuthApiService } from '../../core/auth/auth-api.service';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  animations: [
    trigger('onSideNavChange', [
      state(
        'mini',
        style({
          'margin-left': '65px',
        })
      ),
      state(
        'full',
        style({
          'margin-left': '255px',
        })
      ),
      state(
        'mobile',
        style({
          'margin-left': '0',
        })
      ),
      transition('mini => full', animate('250ms ease-in')),
      transition('full => mini', animate('250ms ease-in')),
    ]),
  ],
})
export class DefaultLayout extends SubscriptionManager implements OnDestroy {
  isStoresComponent!: boolean;
  @ViewChild('snav') sidenav!: MatSidenav;
  @ViewChild(MatSidenavContent) sidenavContent!: MatSidenavContent;
  @ViewChildren(MatExpansionPanel) panels!: MatExpansionPanel[];

  mobileQuery: MediaQueryList;
  currentUser$ = this.authService.currentUser;
  sideMenuItems: MenuItem[];
  private _mobileQueryListener: () => void;

  #sidebarService = inject(SidebarService);

  isSideNavExpanded = this.#sidebarService.expanded;
  sideMenuStatus = this.#sidebarService.mode;

  #storesService = inject(StoresApiService);
  #selectedStoreService = inject(SelectedStoreService);
  #orderService = inject(OrderService);

  stores = toSignal(this.#storesService.getStoreNames(), { initialValue: [] });
  selectedStore = this.#selectedStoreService.selectedStore;
  isDisplaySelectedStore = this.#selectedStoreService.isDisplaySelectStore;
  isDisplayVoidTransaction = this.#orderService.displayVoidTransaction;

  breakpoints$ = this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(map((result) => result?.breakpoints));

  selectedStoreName = computed(() => {
    return this.stores()?.find((store) => store.id === this.selectedStore())
      ?.name;
  });

  constructor(
    private authService: AuthApiService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.breakpoints$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((breakpoints) => {
        for (const query of Object.keys(breakpoints)) {
          if (breakpoints[query]) {
            switch (query) {
              case Breakpoints.XSmall:
              case Breakpoints.Small:
                this.#sidebarService.setMode('mobile');
                break;
              case Breakpoints.Medium:
                this.#sidebarService.setMode('mini');
                break;
              case Breakpoints.Large:
              case Breakpoints.XLarge:
                // Override usual behavior for cash register page
                const path = this.getFullRoutePath(this.activatedRoute);
                if (path === '/cash-register') {
                  // Use sidebar's 'mini' mode instead of 'open'
                  this.#sidebarService.setMode('mini');
                } else {
                  this.#sidebarService.setMode('open');
                }

                break;
              default:
                this.#sidebarService.setMode('mobile');
            }
          }
        }
      });

    this.sideMenuItems = SIDE_MENU;

    // TODO: Delete. Shop pages already use a separate layout.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoutePath = this.getFullRoutePath(this.activatedRoute);
        if (currentRoutePath === '/stores/:name/shop') {
          this.isStoresComponent = currentRoutePath === '/stores/:name/shop';
        }
        if (currentRoutePath === '/stores/:storeName/shop/checkout') {
          this.isStoresComponent =
            currentRoutePath === '/stores/:storeName/shop/checkout';
        }
      });

    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.currentUser$.subscribe((user: Maybe<any>) => {});
    setTimeout(() => {
      this.logRouteInformation();
    }, 100);
  }

  private logRouteInformation(): void {
    console.log('Current Route:', this.getFullRoutePath(this.activatedRoute));
    if (this.getFullRoutePath(this.activatedRoute) === '/stores/:name/shop') {
      this.isStoresComponent = true;
    }
    if (
      this.getFullRoutePath(this.activatedRoute) ===
      '/stores/:storeName/shop/checkout'
    ) {
      this.isStoresComponent = true;
    }
  }

  private getFullRoutePath(route: ActivatedRoute): string {
    let path = '';
    let currentRoute = route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
      if (currentRoute.routeConfig && currentRoute.routeConfig.path) {
        path += '/' + currentRoute.routeConfig.path;
      }
    }

    return path || 'null';
  }

  onSelectStore(id: number): void {
    this.#selectedStoreService.setSelectedStore(id);
    this.#orderService.reset();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.isStoresComponent = false;
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  toggleSidebar(): void {
    if (this.isSideNavExpanded() === true) {
      this.collapseSidebar();
    } else {
      this.expandSidebar();
    }
  }

  expandSidebar(): void {
    this.#sidebarService.expand();
  }

  collapseSidebar(): void {
    this.#sidebarService.collapse();
    this.closeExpansionPanels();
  }

  handleSignout() {
    this.authService.logOut();
  }

  getRouterUrl(): String {
    return this.router.url;
  }

  closeExpansionPanels() {
    if (!this.panels) {
      console.error('No panels to close');
    }

    for (const panel of this.panels) {
      panel.expanded = false;
    }
  }

  goToProfilePage() {
    this.router.navigate(['/profile']);
  }
}
