import type { FormControl } from '@angular/forms';

export interface AddUserForm {
  username: FormControl<string>;
  password: FormControl<string>;
  verifyPassword: FormControl<string>;
  email: FormControl<string>;
  subscribeToNewsletter: FormControl<boolean>;
}
