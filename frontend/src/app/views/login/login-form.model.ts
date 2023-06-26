import { FormControl } from '@angular/forms';

export interface LoginFormModel {
  username: string;
  password: string;
}

export interface LoginForm<FormGroup> {
  username: FormControl<string>;
  password: FormControl<string>;
}
