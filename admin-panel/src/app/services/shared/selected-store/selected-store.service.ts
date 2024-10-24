import { Injectable, effect, signal } from '@angular/core';

const SELECTED_STORE_KEY = 'SELECTED_STORE';

@Injectable({
  providedIn: 'root',
})
export class SelectedStoreService {
  #selectedStore = signal(1);
  #displaySelectStore = signal(false);

  selectedStore = this.#selectedStore.asReadonly();
  isDisplaySelectStore = this.#displaySelectStore.asReadonly();

  persistSelectedStore = effect(() => {
    localStorage.setItem(SELECTED_STORE_KEY, this.selectedStore().toString());
  });

  constructor() {
    const selectedStore = localStorage.getItem(SELECTED_STORE_KEY);
    if (selectedStore) {
      this.#selectedStore.set(parseInt(selectedStore));
    }
  }

  setSelectedStore(id: number): void {
    this.#selectedStore.set(id);
  }

  setDisplaySelectStore(display: boolean): void {
    this.#displaySelectStore.set(display);
  }
}
