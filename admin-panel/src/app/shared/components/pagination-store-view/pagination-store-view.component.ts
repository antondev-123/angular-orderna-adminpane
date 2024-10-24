import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination-store-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-store-view.component.html',
  styleUrls: ['./pagination-store-view.component.css']
})
export class PaginationStoreViewComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages:any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  // Method to handle page navigation
  onPageChange(event: Event, page: number) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    this.currentPage = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

  // Method to handle previous page navigation
  onPreviousPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.onPageChange(event, this.currentPage - 1);
    }
  }

  // Method to handle next page navigation
  onNextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.onPageChange(event, this.currentPage + 1);
    }
  }

  // Helper method to check if the page is a number and navigate
  isNumberAndChangePage(event: Event, page: number | string): void {
    if (typeof page === 'number') {
      this.onPageChange(event, page);
    }
  }

  // Generate an array of page numbers with ellipsis for pagination display
  get paginationPages(): (number | string)[] {
    const pages: (number | string)[] = [];

    if (this.totalPages <= 5) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    if (this.currentPage <= 3) {
      pages.push(1, 2, 3, '...', this.totalPages);
    } else if (this.currentPage >= this.totalPages - 2) {
      pages.push(1, '...', this.totalPages - 2, this.totalPages - 1, this.totalPages);
    } else {
      pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', this.totalPages);
    }

    return pages;
  }
}
