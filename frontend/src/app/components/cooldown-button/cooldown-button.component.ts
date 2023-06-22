import { Component } from '@angular/core';

@Component({
  selector: 'cooldown-button',
  templateUrl: './cooldown-button.component.html',
  styleUrls: ['./cooldown-button.component.scss'],
})
export class CooldownButtonComponent {
  protected isButtonDisabled = false;
  protected progress = 100;

  protected onButtonClick(): void {
    this.isButtonDisabled = true;

    const interval = setInterval(() => {
      this.progress -= 1; // ajustez cette valeur en fonction de la durée du cooldown
      if (this.progress <= 0) {
        clearInterval(interval);
        this.isButtonDisabled = false;
        this.progress = 100;
      }
    }, 50); // ajustez cette valeur en fonction de la durée du cooldown
  }
}
