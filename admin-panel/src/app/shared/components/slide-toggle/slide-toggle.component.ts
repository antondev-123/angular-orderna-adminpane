import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { takeUntil } from 'rxjs';

@Directive({
  selector: '[appSlideToggleText]',
  standalone: true,
})
export class SlideToggleDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-slide-toggle',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
  host: {
    '[class.cursor-not-allowed]': 'isDisabled',
  },
})
export class SlideToggleComponent
  extends SubscriptionManager
  implements OnInit, AfterContentInit
{
  @Input() id!: string;
  @Input('disabled') isDisabled: boolean = false;
  @Input() ariaLabel!: string;
  @Input() ariaControls?: string;
  @Input() checked?: boolean = true;
  @Input() controlName!: string;

  @Output() btnToggle = new EventEmitter<MatSlideToggleChange>();
  @Output() onChange = new EventEmitter<MatSlideToggleChange>();

  isPhonePortrait = false;
  hasText = false;

  constructor(private responsive: BreakpointObserver) {
    super();
  }

  @ContentChild(SlideToggleDirective) text!: SlideToggleDirective;

  ngAfterContentInit() {
    this.hasText = !!this.text;
  }
  ngOnInit(): void {
    this.responsive
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.isPhonePortrait = false;
        if (result.matches) {
          this.isPhonePortrait = true;
        }
      });
  }
}
