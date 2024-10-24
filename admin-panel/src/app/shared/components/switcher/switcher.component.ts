import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  standalone: true,
})
export class SwitcherComponent {
  checked = model(false);
  disabled = input(false);

  protected toggle(): void {
    if (this.disabled()) return;

    this.checked.update((checked) => !checked);
  }
}


