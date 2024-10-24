import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-request',
  standalone: true,
  imports: [ButtonComponent, RouterModule],
  templateUrl: './dashboard-request.component.html',
  styleUrl: './dashboard-request.component.css',
})
export class DashboardRequestComponent {
  constructor(private router: Router) {}

  requestFeature() {
    this.router.navigate(['/features']);
  }
}
