import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import {
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';

// TODO: Flatten
interface TextAreaConfig {
  minRows: number;
  maxRows?: number;
  autoResize?: boolean;
}
@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    CdkTextareaAutosize,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './textarea.component.html',
  styleUrl: '../input.component.scss',
})
export class InputTextAreaComponent implements OnInit, OnDestroy {
  private injector = inject(Injector);

  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() validators: ValidatorFn[] = [];
  @Input() value: Maybe<string>  = '';
  @Input() hintText?: string;

  // TODO: Delete. Already specified in 'textAreaConfig'
  @Input() rows: number = 3;

  // TODO: Rename
  @Input() textAreaConfig: TextAreaConfig = { minRows: 4, maxRows: 4 };

  text!: FormControl;
  parentContainer = inject(ControlContainer);

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get required() {
    return this.text.hasValidator(Validators.required);
  }

  get hasHint() {
    return !!this.hintText;
  }

  ngOnInit() {
    this.text = new FormControl(this.value || '', this.validators);
    this.parentFormGroup.addControl(this.controlName, this.text);
  }

  ngOnDestroy() {
    this.parentFormGroup?.removeControl(this.controlName);
  }

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this.injector,
      }
    );
  }
}
