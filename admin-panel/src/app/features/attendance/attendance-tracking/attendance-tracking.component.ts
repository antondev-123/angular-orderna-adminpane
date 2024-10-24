import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { SwitcherComponent } from '@orderna/admin-panel/src/app/shared/components/switcher/switcher.component';
import { AttendanceTrackingType } from '@orderna/admin-panel/src/app/model/attendance-tracking-type';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-attendance-tracking',
  standalone: true,
  imports: [
    SwitcherComponent,
    ButtonTextDirective,
    ButtonComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FlatpickrModule,
    FormsModule,
    NgTemplateOutlet,
  ],
  templateUrl: './attendance-tracking.component.html',
  styleUrl: './attendance-tracking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackingComponent {
  type = input.required<AttendanceTrackingType>();
  trackingTime = input.required<Date | undefined>();
  trackingImage = input.required<string | undefined>();
  disabled = input.required<boolean>();
  disabledCalendar = input(true);

  imageSubmitted = output<string>();
  imageResubmitted = output<string>();

  trackingTemplate = contentChild.required(TemplateRef);

  title = computed(() =>
    this.type() === AttendanceTrackingType.CLOCK_IN ? 'Clock In' : 'Clock Out'
  );

  submitImage(image: string): void {
    this.imageSubmitted.emit(image);
  }

  resubmitImage(image: string): void {
    this.imageResubmitted.emit(image);
  }
}
