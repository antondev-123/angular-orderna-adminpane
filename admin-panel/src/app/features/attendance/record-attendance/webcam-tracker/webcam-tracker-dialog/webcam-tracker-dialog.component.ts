import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { WebcamImage, WebcamInitError, WebcamModule } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-webcam-tracker-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ButtonComponent,
    ButtonTextDirective,
    WebcamModule,
  ],
  templateUrl: './webcam-tracker-dialog.component.html',
  styleUrls: [
    '/admin-panel/src/app/shared/components/modal/modal.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WebcamTrackerDialogComponent {
  #matDialogRef = inject(MatDialogRef);
  protected allowCameraSwitch = false;
  protected facingMode = 'user'; //Set front camera

  protected title = inject(MAT_DIALOG_DATA);
  protected error = signal(false);

  #trigger = new Subject<void>();
  #nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  onImageCapture(webcamImage: WebcamImage): void {
    this.#matDialogRef.close(webcamImage.imageAsDataUrl);
  }

  triggerSnapshot(): void {
    this.#trigger.next();
  }

  onInitWebcamError(error: WebcamInitError): void {
    this.error.set(true);
  }

  close(): void {
    this.#matDialogRef.close();
  }

  get trigger() {
    return this.#trigger.asObservable();
  }

  get nextWebcam() {
    return this.#nextWebcam.asObservable();
  }
}
