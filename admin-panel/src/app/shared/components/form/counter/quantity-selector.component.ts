import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  template: `
    <div [class]="isXs ? '' : 'space-x-2'" class="inline-flex">
      <button (click)="subtractQuantity()"
              class="btn-sm p-1.5 shrink-0 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm">
        <svg [class]="isXs ? ['w-2', 'h-2'] : ['w-4', 'h-4']" class="fill-current text-indigo-500" viewBox="0 0 16 16">
          <path d="M15 7H1C0.4 7 0 7.4 0 8s0.4 1 1 1h14c0.6 0 1-0.4 1-1S15.6 7 15 7Z"></path>
        </svg>
      </button>
      <div class="shrink font-bold w-8 text-center">
        {{ productQuantity }}
      </div>
      <button (click)="addQuantity()"
              class="btn-sm p-1.5 shrink-0 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm">
        <svg [class]="isXs ? ['w-2', 'h-2'] : ['w-4', 'h-4']" class="fill-current text-indigo-500" viewBox="0 0 16 16">
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1Z"></path>
        </svg>
      </button>
    </div>
  `,
})
export class QuantitySelectorComponent {
  @Input() productQuantity: number = 0;
  @Input() isXs: boolean = false;
  @Output() quantityChange: EventEmitter<number> = new EventEmitter<number>();

  addQuantity(): void {
    this.quantityChange.emit(this.productQuantity + 1);
  }

  subtractQuantity(): void {
    if (this.productQuantity > 0) {
      this.quantityChange.emit(this.productQuantity - 1);
    }
  }
  
}
