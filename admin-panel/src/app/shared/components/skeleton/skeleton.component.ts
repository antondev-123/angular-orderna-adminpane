import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  host: {
    class: 'ord-skeleton',
  },
})
export class SkeletonComponent {
  type = input<'circle' | 'square'>('square');
}
