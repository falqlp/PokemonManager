import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NewsV11Component } from '../../../components/news/news-v1-1/news-v1-1.component';

@Component({
  selector: 'pm-main-page',
  standalone: true,
  imports: [
    MatButton,
    NgOptimizedImage,
    RouterLink,
    TranslateModule,
    NewsV11Component,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}