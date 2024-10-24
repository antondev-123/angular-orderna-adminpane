import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { AttendanceTrackingComponent } from '../../attendance-tracking/attendance-tracking.component';
import { WebcamTrackerDialogComponent } from './webcam-tracker-dialog/webcam-tracker-dialog.component';

@Component({
  selector: 'app-webcam-tracker',
  standalone: true,
  imports: [MatIconModule, ButtonComponent, ButtonTextDirective],
  templateUrl: './webcam-tracker.component.html',
  styleUrl: './webcam-tracker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamTrackerComponent {
  #matDialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);
  #attendanceTracking = inject(AttendanceTrackingComponent);

  trackingImage = this.#attendanceTracking.trackingImage;
  disabled = this.#attendanceTracking.disabled;
  title = this.#attendanceTracking.title;

  submitImage(): void {
    this.#matDialog
      .open(WebcamTrackerDialogComponent, {
        data: this.title(),
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((image) => {
        if (image) {
          this.#attendanceTracking.submitImage(image);
        }
      });
  }

  resubmitImage(): void {
    this.#matDialog
      .open(WebcamTrackerDialogComponent, {
        data: this.title(),
        panelClass: 'webcam-dialog',
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((image) => {
        if (image) {
          this.#attendanceTracking.resubmitImage(image);
        }
      });
  }
}
