import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '@orderna/admin-panel/src/app/shared/components/input/text/text.component';
import { InputTextAreaComponent } from '@orderna/admin-panel/src/app/shared/components/input/textarea/textarea.component';
import { StoreDetailsControl } from '../../types/tcontrol';

@Component({
  selector: 'app-store-details',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent, InputTextAreaComponent],
  templateUrl: './store-details.component.html',
  styleUrl: './store-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDetailsComponent {
  Validators = Validators;
  form = input.required<FormGroup<StoreDetailsControl>>();
}
