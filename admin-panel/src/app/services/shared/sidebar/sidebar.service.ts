import { Injectable, signal } from '@angular/core';

// Mode   | Screen Size     | Collapsible?
// ----------------------------------------
// mobile | XSmall, Small   | Yes
// mini   | Medium          | Yes
// open   | Large, XLarge   | No
export type SidebarMode = 'mobile' | 'mini' | 'open';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  #expanded = signal(true);
  #mode = signal<SidebarMode>('mobile');

  expanded = this.#expanded.asReadonly();
  mode = this.#mode.asReadonly();

  collapse(): void {
    this.#expanded.set(false);
  }

  expand(): void {
    this.#expanded.set(true);
  }

  setMode(mode: SidebarMode): void {
    this.#mode.set(mode);
  }
}
