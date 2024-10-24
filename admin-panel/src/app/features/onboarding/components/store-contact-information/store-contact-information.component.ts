import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { InputTextComponent } from '@orderna/admin-panel/src/app/shared/components/input/text/text.component';
import { StoreContactInformationControl } from '../../types/tcontrol';
import { InputMobileComponent } from '@orderna/admin-panel/src/app/shared/components/input/contact/mobile/mobile.component';
import { InputTelephoneComponent } from '@orderna/admin-panel/src/app/shared/components/input/contact/telephone/telephone.component';
import { InputEmailComponent } from '@orderna/admin-panel/src/app/shared/components/input/email/email.component';

@Component({
  selector: 'app-store-contact-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    InputMobileComponent,
    InputTelephoneComponent,
    InputEmailComponent,
  ],
  templateUrl: './store-contact-information.component.html',
  styleUrl: './store-contact-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreContactInformationComponent {
  readonly websiteUrlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  Validators = Validators;
  form = input.required<FormGroup<StoreContactInformationControl>>();
}
