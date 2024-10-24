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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { SubscriptionManager } from '@orderna/admin-panel/src/utils/subscription-manager';
import { takeUntil } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';

type ButtonVariant =
  | 'primary' // Button with solid primary background
  | 'secondary' // Button with white background and outline
  | 'subdued' // Button with transparent background and outline
  | 'warn' // Button with solid warn background
  | 'ghost' // Button with no background and outline;
  | 'outlined'; // Button with no background and outline
type ButtonTextColor = 'indigo' | 'white' | 'red' | 'gray';
type ButtonSize = 'lg' | 'base' | 'sm' | 'xs';

@Directive({
  selector: '[appButtonText]',
  standalone: true,
})
export class ButtonTextDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltip],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class.cursor-not-allowed]': 'isDisabled',
  },
})
export class ButtonComponent
  extends SubscriptionManager
  implements OnInit, AfterContentInit
{
  private static readonly DEFAULT_TEXT_COLOR_BY_VARIANT: Record<
    ButtonVariant,
    ButtonTextColor
  > = {
    primary: 'white',
    warn: 'white',
    secondary: 'gray',
    subdued: 'red',
    ghost: 'gray',
    outlined: 'indigo',
  };

  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'base';
  @Input('disabled') isDisabled: boolean = false;
  @Input() ariaLabel!: string;
  @Input() textColor?: ButtonTextColor;
  @Input() ariaControls?: string;
  @Input() svgIcon?: string;
  @Input() fullWidth: boolean = false;
  @Input() tooltip?: string;

  @Output() btnClick = new EventEmitter();

  @ContentChild(ButtonTextDirective) text!: ButtonTextDirective;

  isPhonePortrait = false;
  hasText = false;

  get hasIcon() {
    return !!this.svgIcon;
  }

  get isIconOnly() {
    return this.hasIcon && (!this.hasText || this.isPhonePortrait);
  }

  constructor(private responsive: BreakpointObserver) {
    super();
  }

  ngOnInit() {
    this.responsive
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.isPhonePortrait = false;
        if (result.matches) {
          this.isPhonePortrait = true;
        }
      });

    this.initTextColor();
  }

  ngAfterContentInit() {
    this.hasText = !!this.text;
  }

  initTextColor() {
    if (!this.textColor) {
      this.textColor =
        ButtonComponent.DEFAULT_TEXT_COLOR_BY_VARIANT[this.variant];
    }
  }

  get buttonClasses(): { [key: string]: boolean } {
    return {
      'ord-button': true,
      'ord-icon-button': this.isIconOnly,
      'ord-flat-button': !this.isIconOnly,
      'ord-button-primary': this.variant === 'primary',
      'ord-button-warn': this.variant === 'warn',
      'ord-button-secondary': this.variant === 'secondary',
      'ord-button-subdued': this.variant === 'subdued',
      'ord-button-ghost': this.variant === 'ghost',
      'ord-button-outlined': this.variant === 'outlined',
      'ord-button-base': this.size === 'base',
      'ord-button-xs': this.size === 'xs',
      'ord-button-sm': this.size === 'sm',
      'ord-button-lg': this.size === 'lg',
      'ord-button-indigo': this.textColor === 'indigo',
      'ord-button-white': this.textColor === 'white',
      'ord-button-gray': this.textColor === 'gray',
      'ord-button-red': this.textColor === 'red',
      'ord-button-w-full': this.fullWidth,
    };
  }

  handleClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.btnClick.emit();
  }
}
