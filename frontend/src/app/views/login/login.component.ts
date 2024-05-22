import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CacheService } from '../../services/cache.service';
import { RouterService } from '../../services/router.service';
import { LoginForm } from './login-form.model';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../../modals/add-user/add-user.component';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ForgottenPasswordComponent } from '../../modals/forgotten-password/forgotten-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup<LoginForm>({
    username: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  });

  constructor(
    protected authService: AuthService,
    protected router: RouterService,
    protected destroyRef: DestroyRef,
    protected cacheService: CacheService,
    protected dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    localStorage.clear();
    this.cacheService.setUserId(undefined);
    this.cacheService.setTrainerId(undefined);
    this.cacheService.setGameId(undefined);
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

  protected createAccount(): void {
    this.dialog.open(AddUserComponent);
  }

  protected forgottenPassword(): void {
    this.dialog.open(ForgottenPasswordComponent);
  }
}
