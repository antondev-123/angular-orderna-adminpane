import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountFormComponent } from '../components/discount-form/discount-form.component';

@Component({
  selector: 'app-discount-create',
  standalone: true,
  imports: [CommonModule, DiscountFormComponent],
  templateUrl: './discount-create.component.html',
  styleUrl: './discount-create.component.scss',
})
export class DiscountCreateComponent {}
