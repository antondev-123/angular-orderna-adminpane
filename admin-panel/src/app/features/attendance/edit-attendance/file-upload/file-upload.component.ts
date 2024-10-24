import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { AttendanceTrackingComponent } from '../../attendance-tracking/attendance-tracking.component';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [ButtonComponent, ButtonTextDirective],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  fileUploadInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileUploadInput');

  #attendanceTracking = inject(AttendanceTrackingComponent);

  protected trackingImage = this.#attendanceTracking.trackingImage;
  protected disabled = this.#attendanceTracking.disabled;
  protected type = this.#attendanceTracking.type;
  protected fileUploadId = computed(() => `${this.type()}-file-upload`);

  #isUpdatedImage = false;

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.#isUpdatedImage) {
          this.#attendanceTracking.resubmitImage(reader.result as string);
          return;
        }

        this.#attendanceTracking.submitImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  resubmitImage() {
    this.#isUpdatedImage = true;
    this.fileUploadInput().nativeElement.click();
  }
}
