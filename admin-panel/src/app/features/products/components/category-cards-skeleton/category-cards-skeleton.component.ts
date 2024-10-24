import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '@orderna/admin-panel/src/app/shared/components/skeleton/skeleton.component';
import { TableSkeletonComponent } from '@orderna/admin-panel/src/app/shared/components/table/table-skeleton.component';

@Component({
  selector: 'app-category-cards-skeleton',
  standalone: true,
  imports: [TableSkeletonComponent, SkeletonComponent],
  templateUrl: './category-cards-skeleton.component.html',
  styleUrl: './category-cards-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardsSkeletonComponent {
  cards = Array(3).fill('');
}
