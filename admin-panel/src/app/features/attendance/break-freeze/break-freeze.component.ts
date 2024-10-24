import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../../../shared/components/button/button.component';
import { InputTextComponent } from '../../../shared/components/input/text/text.component';
import { RegisterComponent } from '../../register/register.component';

@Component({
  selector: 'app-break-freeze',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    ButtonComponent,
    ButtonTextDirective,
  ],
  templateUrl: './break-freeze.component.html',
  styleUrl: './break-freeze.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreakFreezeComponent {
  protected RegisterComponent = RegisterComponent;

  protected Validators = Validators;
  #router = inject(Router);

  protected formGroup = new FormGroup({
    pin: new FormControl<string>('', [Validators.required]),
  });

  protected getBackToWork(): void {
    this.#router.navigateByUrl('/attendances/record');
  }
}
