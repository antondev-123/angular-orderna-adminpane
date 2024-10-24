import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-store-cards-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './store-cards-skeleton.component.html',
  styleUrl: './store-cards-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreCardsSkeletonComponent {
  cards = Array(9).fill('');
}
