import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CUSTOMERS } from '../../data/customers';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shop-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterOutlet,
  ],
  templateUrl: './shop-layout.component.html',
  styleUrl: '../default-layout/default-layout.component.scss', // TODO: Refactor
})
export class ShopLayout {
  customer = CUSTOMERS[0];

  handleSignout() {
    // TODO
  }
}
