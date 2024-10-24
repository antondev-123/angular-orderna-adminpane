import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-onboarding-layout',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './onboarding-layout.component.html',
  styleUrl: './onboarding-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingLayout {}
