import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WageService } from '@orderna/admin-panel/src/app/services/wage/wage.service';
import { map } from 'rxjs';
import {
  TimelineComponent,
  TimelineContentDirective,
} from '../../../../shared/components/timeline/timeline.component';
import { AuthApiService } from '@orderna/admin-panel/src/app/core/auth/auth-api.service';

@Component({
  selector: 'app-wage-summary',
  template: `
    <div class="ord-card">
      <div class="pt-4 px-8">
        <h1 class="font-semibold text-large mb-2">Wage Summary</h1>

        <div class="pt-8 pb-4 border-t">
          <app-timeline [events]="wages()">
            <ng-template appTimelineContent let-summary>
              <div class="flex gap-2 text-[14px]">
                <span class="font-semibold">₱{{ summary.wagePerHour }}</span>
                <span class="text-[#64748b]">—</span>
                <span class="text-[#64748b]">
                  {{ summary.startDate | date : 'MMMM dd, y' }}
                </span>
              </div>
            </ng-template>
          </app-timeline>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wage-summary.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TimelineComponent, TimelineContentDirective],
})
export class WageSummaryComponent {
  #wageService = inject(WageService);
  #authService = inject(AuthApiService);
  wages = toSignal(
    this.#wageService
      .getWageSummaryByUserId(this.#authService.currentUserValue!.id)
      .pipe(
        map((wages) =>
          wages.map((wage) => ({
            ...wage,
            status: wage.isActive ? 'success' : 'pending',
          }))
        )
      ),
    { initialValue: [] }
  );
}
