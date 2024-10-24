import { NgTemplateOutlet } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-store-cards-skeleton',
  standalone: true,
  imports: [CardComponent, SkeletonComponent, NgTemplateOutlet],
  templateUrl: './store-cards-skeleton.component.html',
  styleUrl: './store-cards-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreCardsSkeletonComponent {
  cards = Array(5).fill('');
}
