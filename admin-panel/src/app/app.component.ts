import { Component, Inject } from '@angular/core';
import { Router, RouterOutlet, RoutesRecognized } from '@angular/router';
import { DefaultLayout } from './layouts/default-layout/default-layout.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { LoaderService } from './services/shared/loader/loader.service';
import { Maybe } from '../types/maybe';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubscriptionManager } from '../utils/subscription-manager';
import { takeUntil } from 'rxjs';
import { CUSTOM_ICONS } from '../utils/constants/icons';
import { ShopLayout } from './layouts/shop-layout/shop-layout.component';
import { AuthApiService } from './core/auth/auth-api.service';
import { OnboardingLayout } from './layouts/onboarding-layout/onboarding-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DefaultLayout, ShopLayout, OnboardingLayout],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    '[class.cursor-wait]': 'loading',
  },
})
export class AppComponent extends SubscriptionManager {
  title = 'admin-panel';
  pageLayout: string = 'default';

  // Will make cursor 'cursor-wait' if true
  loading: Maybe<boolean>;

  constructor(
    private authService: AuthApiService,
    private loaderService: LoaderService,
    private router: Router,
    private overlayContainer: OverlayContainer,

    @Inject(MatIconRegistry) private readonly iconRegistry: MatIconRegistry,
    @Inject(DomSanitizer) private readonly sanitizer: DomSanitizer
  ) {
    super();

    this.loaderService
      .getLoading()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((loading) => {
        this.loading = loading;
        this.loadingChanged();
      });

    this.authService.currentUser
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.userChanged();
      });

    this.registerCustomSvgIcons();
  }

  loadingChanged() {
    if (this.loading) {
      this.overlayContainer.getContainerElement().classList.add('cursor-wait');
    } else {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('cursor-wait');
    }
  }

  userChanged() {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((evt) => {
      if (evt instanceof RoutesRecognized) {
        this.pageLayout =
          evt.state.root.firstChild?.data['layout'] ?? 'default';
      }
    });
  }

  registerCustomSvgIcons() {
    for (const icon of CUSTOM_ICONS) {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `./assets/icons/${icon}.svg`
        )
      );
    }
  }
}
