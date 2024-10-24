import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ShopSidebarSummaryComponent } from '../shop-sidebar-summary/shop-sidebar-summary.component';
import { CartService } from '@orderna/admin-panel/src/app/services/cart/cart.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IAddress } from '@orderna/admin-panel/src/app/model/store';

@Component({
  selector: 'app-review-order',
  standalone: true,
  imports: [
    ShopSidebarSummaryComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.css'],
})
export class ReviewOrderComponent implements OnInit {
  billingForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.billingForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^\\+?1?\\d{9,15}$')],
      ], // Adjust regex as needed
      note: [''],
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.billingForm.valid) {
      const billingInfo: IAddress = this.billingForm.value;
      this.cartService.setBillingInfo(billingInfo);
      console.log('Billing Info:', billingInfo);
    } else {
      console.log('Form is not valid');
    }
  }

  onPlaceOrder(): void {
    this.onSubmit();
  }
}
