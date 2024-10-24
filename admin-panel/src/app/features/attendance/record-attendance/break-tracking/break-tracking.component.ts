import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BadgeComponent } from '@orderna/admin-panel/src/app/shared/components/badge/badge.component';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';

@Component({
  selector: 'app-break-tracking',
  template: `
    <div class="ord-card" [class.cursor-not-allowed]="disabled()">
      <div class="pt-4 px-8">
        <div class="flex gap-4 items-center mb-2">
          <h1 class="font-semibold text-large">Break</h1>
          @if (activeBreak()) {
          <app-badge text="Active"></app-badge>
          }
        </div>

        <div class="border-t"></div>

        @if (activeBreak()) {
        <div class="pt-4 text-sm font-medium">
          There is currently a break session starting at
          {{ activeBreak() | date : 'HH:mm' }}
        </div>
        }

        <div [class.pointer-events-none]="disabled()" class="flex gap-4 py-4">
          <app-button
            [disabled]="disabled() || !!activeBreak()"
            size="sm"
            variant="outlined"
            (btnClick)="breakStarted.emit()"
          >
            <ng-template appButtonText>Start Break</ng-template>
          </app-button>

          <app-button
            [disabled]="disabled() || !activeBreak()"
            size="sm"
            variant="outlined"
            (btnClick)="breakEnded.emit()"
          >
            <ng-template appButtonText>End Break</ng-template>
          </app-button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, ButtonTextDirective, BadgeComponent, DatePipe],
})
export class BreakTrackingComponent {
  activeBreak = input.required<Date | undefined>();
  disabled = input.required<boolean>();

  breakStarted = output();
  breakEnded = output();
}
