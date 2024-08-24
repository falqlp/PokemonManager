import type { FormControl } from '@angular/forms';

export interface LoginFormModel {
  username: string;
  password: string;
}

export interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}
