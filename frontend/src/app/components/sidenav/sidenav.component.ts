import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterService } from '../../services/router.service';
import { SidenavService } from './sidenav.service';

export interface NavsModel {
  link: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'pm-sidenav',
  standalone: true,
  imports: [TranslateModule, NgForOf, MatIconModule, MatRippleModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  constructor(
    protected routerService: RouterService,
    protected sidenavService: SidenavService
  ) {}

  protected navs: NavsModel[] = [
    {
      link: 'home',
      label: 'HOME',
      icon: 'home',
    },
    {
      link: 'pcStorage',
      label: 'PC-STORAGE',
      icon: 'computer',
    },
    {
      link: 'nursery',
      label: 'NURSERY',
      icon: 'egg',
    },
    {
      link: 'pokedex',
      label: 'POKEDEX',
      icon: 'devices',
    },
    {
      link: 'trainers',
      label: 'TRAINERS',
      icon: 'groups',
    },
  ];

  protected click(route: string): void {
    this.routerService.navigateByUrl(route);
    this.sidenavService.closeSidenav();
  }
}
