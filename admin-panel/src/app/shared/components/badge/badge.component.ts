import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() ariaLabel!: string;

  readonly badgeColorClassByStatusMap: { [key: string]: string } = {
    active: 'ord-badge-green',
    approved: 'ord-badge-green',
    archived: 'ord-badge-gray',
    completed: 'ord-badge-green',
    expired: 'ord-badge-red',
    fail: 'ord-badge-red',
    inactive: 'ord-badge-red',
    parked: 'ord-badge-yellow',
    pending: 'ord-badge-gray',
    refunded: 'ord-badge-red',
    scheduled: 'ord-badge-yellow',
    void: 'ord-badge-gray',
    'in progress': 'ord-badge-yellow',
  };

  get badgeClasses() {
    return [
      'ord-badge',
      this.badgeColorClassByStatusMap[this.text.toLowerCase()] ||
        'ord-badge-gray',
    ];
  }
}
