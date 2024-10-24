import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from '@orderna/admin-panel/src/app/shared/components/input/text/text.component';
import { StoreAddressControl } from '../../types/tcontrol';

@Component({
  selector: 'app-store-address',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent],
  templateUrl: './store-address.component.html',
  styleUrl: './store-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreAddressComponent {
  Validators = Validators;
  form = input.required<FormGroup<StoreAddressControl>>();
}
