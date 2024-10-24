import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SidebarService } from '../../services/shared/sidebar/sidebar.service';
import { SelectedStoreService } from '../../services/shared/selected-store/selected-store.service';
import { CashRegisterSidebarComponent } from './cash-register-sidebar.component';
import { CashRegisterContentComponent } from './cash-register-content.component';
import { OrderService } from '../../services/shared/order/order.service';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [CashRegisterSidebarComponent, CashRegisterContentComponent],
  templateUrl: './cash-register.component.html',
})
export class CashRegisterComponent implements OnInit, OnDestroy {
  #sidebarService = inject(SidebarService);
  #storeService = inject(SelectedStoreService);
  #orderService = inject(OrderService);

  #prevMode = this.#sidebarService.mode();
  #prevExpandedState = this.#sidebarService.expanded();

  ngOnInit(): void {
    this.#storeService.setDisplaySelectStore(true);
    this.#orderService.setDisplayVoidTransaction(true);

    this.initSidebar();
  }

  ngOnDestroy(): void {
    this.#storeService.setDisplaySelectStore(false);
    this.#orderService.setDisplayVoidTransaction(false);

    this.#sidebarService.setMode(this.#prevMode);
    if (this.#prevExpandedState === true) {
      this.#sidebarService.expand();
    } else {
      this.#sidebarService.collapse();
    }
  }

  initSidebar() {
    // Sidebar in cash register page should be collapsed by default

    // Ensure sidebar mode is at least 'mini', so we can collapse it
    // Note: User can only collapse sidebar in 'mini' or 'mobile' mode
    if (!['mini', 'mobile'].includes(this.#prevMode)) {
      this.#sidebarService.setMode('mini');
    }

    // Collapse sidebar
    this.#sidebarService.collapse();
  }
}
