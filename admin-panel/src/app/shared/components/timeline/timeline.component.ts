import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';
import { isKeyOf } from '@orderna/admin-panel/src/utils/is-key-of';

@Directive({
  selector: '[appTimelineContent]',
  standalone: true,
})
export class TimelineContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent<T extends { [key: string]: any }> {
  @Input() events!: T[];

  @ContentChild(TimelineContentDirective) content!: TimelineContentDirective;

  readonly markerColorClassByStatusMap: { [key: string]: string } = {
    refunded: 'ord-bg-yellow',
    approved: 'ord-bg-green',
    active: 'ord-bg-green',
    pending: 'ord-bg-gray',
    expired: 'ord-bg-red',
    inactive: 'ord-bg-red',
    fail: 'ord-bg-red',
  };

  getMarkerColorClass(event: T) {
    let markerColorClass = 'ord-bg-indigo';
    if (isKeyOf(event, 'status')) {
      markerColorClass =
        this.markerColorClassByStatusMap[event['status']] ?? markerColorClass;
    }
    return markerColorClass;
  }
}
