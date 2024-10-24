import { CommonModule } from '@angular/common';
import { Component, Input, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { clamp } from '@orderna/admin-panel/src/utils/clamp';
import {
  ButtonComponent,
  ButtonTextDirective,
} from '../button/button.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ButtonTextDirective],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() numberOfItems!: number;
  @Input() currentPage!: number;
  @Input() perPage: number = 10;
  @Input() perPages: number[] = [];

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  get numberOfPages() {
    return Math.ceil(this.numberOfItems / this.perPage);
  }

  get isFirstPage() {
    return this.currentPage === 1;
  }

  get isLastPage() {
    return this.currentPage === this.numberOfPages;
  }

  changePage(newPage: number) {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        page: clamp(newPage, 1, this.numberOfPages),
      },
      queryParamsHandling: 'merge',
    });
  }

  changePerPage(event: any) {
    this.perPage = event.target.value;

    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        perPage: this.perPage,
      },
      queryParamsHandling: 'merge',
    });
  }
}
