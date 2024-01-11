import { Component, DestroyRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CacheService } from '../../services/cache.service';
import { RouterService } from '../../services/router.service';

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
    protected router: RouterService,
    protected destroyRef: DestroyRef,
    protected cacheService: CacheService
  ) {
    localStorage.clear();
  }

  public login(): void {
    if (this.loginForm.valid) {
      this.authService
        .login({
          username: this.loginForm.controls.username.value,
          password: this.loginForm.controls.password.value,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((response) => {
          if (response) {
            this.cacheService.setUserId(response._id);
            this.router.navigateByUrl('games');
          }
        });
    }
  }
}
