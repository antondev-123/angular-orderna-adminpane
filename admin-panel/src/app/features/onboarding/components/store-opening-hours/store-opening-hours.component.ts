import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { StoreOpeningHourCardComponent } from '../../../stores/store-settings/store-opening-hour-card/store-opening-hour-card.component';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WEEKLY_OPENING_HOURS_TOKEN } from '../../onboarding.component';
import { WeeklyOpeningHours } from '@orderna/admin-panel/src/app/model/store';
import { WEEKLY } from './weekdays';

@Component({
  selector: 'app-store-opening-hours',
  standalone: true,
  imports: [ReactiveFormsModule, StoreOpeningHourCardComponent],
  templateUrl: './store-opening-hours.component.html',
  styleUrl: './store-opening-hours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreOpeningHoursComponent {
  readonly WEEKLY = WEEKLY;

  Validators = Validators;
  form = input.required<FormGroup>();
  weeklyOpeningHours = inject<WeeklyOpeningHours>(WEEKLY_OPENING_HOURS_TOKEN);
}
