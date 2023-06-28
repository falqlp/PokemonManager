import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { PlayerService } from 'src/app/services/player.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  });

  constructor(
    protected authService: AuthService,
    protected playerService: PlayerService,
    protected rooter: Router
  ) {}

  public login(): void {
    if (this.loginForm.valid) {
      this.authService
        .login({
          username: this.loginForm.controls.username.value as string,
          password: this.loginForm.controls.password.value as string,
        })
        .subscribe((response) => {
          if (response) {
            this.playerService.updatePlayer(response);
            this.rooter.navigateByUrl('home');
          }
        });
    }
  }
}
