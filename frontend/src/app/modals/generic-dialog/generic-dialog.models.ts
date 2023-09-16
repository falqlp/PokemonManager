import { ThemePalette } from '@angular/material/core';

export interface DialogButtonsModel {
  label: string;
  color: ThemePalette;
  click?: () => void;
  close?: boolean;
}
