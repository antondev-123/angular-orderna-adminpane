import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  TemplateRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '@orderna/admin-panel/src/app/shared/components/button/button.component';
import { InputEmailComponent } from '@orderna/admin-panel/src/app/shared/components/input/email/email.component';
import { InputMobileComponent } from '@orderna/admin-panel/src/app/shared/components/input/contact/mobile/mobile.component';
import { InputTextComponent } from '@orderna/admin-panel/src/app/shared/components/input/text/text.component';
import { InputTextAreaComponent } from '@orderna/admin-panel/src/app/shared/components/input/textarea/textarea.component';
import { StoreConfirmCloseModalComponent } from '@orderna/admin-panel/src/app/features/stores/components/store-confirm-close-modal/store-confirm-close-modal.component';
import { StoreConfirmDeleteModalComponent } from '@orderna/admin-panel/src/app/features/stores/components/store-confirm-delete-modal/store-confirm-delete-modal.component';
import { Store } from '@orderna/admin-panel/src/app/model/store';
import { take } from 'rxjs';
import { InputTelephoneComponent } from '@orderna/admin-panel/src/app/shared/components/input/contact/telephone/telephone.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatSlideToggle,

    InputTextComponent,
    InputTextAreaComponent,
    InputEmailComponent,
    InputMobileComponent,
    InputTelephoneComponent,

    ButtonComponent,
    ButtonTextDirective,
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent implements AfterViewInit {
  Validators = Validators;

  private router = inject(Router);
  readonly websiteUrlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  data = input<Store>();
  mode = computed(() => (this.data() ? 'edit' : 'create'));
  actionsTemplate = input<TemplateRef<any>>();
  submit = output<Store>();

  storeForm: FormGroup = this.fb.group({});

  get storeFormRawValue() {
    const rawValue = this.storeForm.getRawValue();
    return {
      ...rawValue,
      mobile: rawValue.mobile,
      telephone: rawValue.telephone,
    };
  }

  get isOpen() {
    return this.storeForm.get('isOpen')?.value;
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initIsPermanentlyClosedToggle();
  }

  ngAfterViewInit(): void {
    const data = this.data();
    if (!data) return;

    this.storeForm.patchValue({
      name: data.name,
      currency: data.currency,
      about: data.about,
      email: data.email,
      mobile: data.mobile,
      telephone: data.telephone,
      website: data.website,
      streetAddress: data.streetAddress,
      buildingNumber: data.buildingNumber,
      city: data.city,
      zipCode: data.zipCode,
      VATNumber: data.VATNumber,
      isOpen : data.isOpen
    });
  }

  initIsPermanentlyClosedToggle() {
    const isOpen = this.data()?.isOpen ?? false;
    this.storeForm.addControl('isOpen', new FormControl(isOpen));
  }

  handleSubmit() {
    this.submit.emit(this.storeFormRawValue);
  }

  handleStoreTemporarilyClosed(value: boolean) {
    if (this.mode() === 'edit' && value) {
      this.openStoreConfirmCloseModal();
    }
  }

  openStoreConfirmCloseModal() {
    const store = this.data();
    if (!store) {
      throw new Error('No store to close');
    }
    const dialogRef = this.dialog.open(StoreConfirmCloseModalComponent, {
      id: 'store-confirm-close-modal',
      data: {
        store,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        this.storeForm.patchValue({
          isOpen: !!result,
        });
      });
  }
  openStoreConfirmDeleteModal() {
    const store = this.data();
    if (!store) {
      throw new Error('No store to delete');
    }
    const dialogRef = this.dialog.open(StoreConfirmDeleteModalComponent, {
      id: 'store-confirm-delete-modal',
      data: {
        store,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['stores']);
        }
      });
  }
}
