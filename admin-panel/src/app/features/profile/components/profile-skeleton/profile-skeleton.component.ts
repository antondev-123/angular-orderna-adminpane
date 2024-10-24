import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from '@orderna/admin-panel/src/app/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-profile-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './profile-skeleton.component.html',
  styleUrl: './profile-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSkeletonComponent {}
