import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorService {
  public arrayMaxLength(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const arrayLength = control.value ? 0 : control.value?.length;
      return arrayLength > max ? { maxLength: { value: arrayLength } } : null;
    };
  }

  public arrayExactLength(value: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const arrayLength = control.value ? control.value?.length : 0;
      return arrayLength !== value ? { length: { value: arrayLength } } : null;
    };
  }
}
