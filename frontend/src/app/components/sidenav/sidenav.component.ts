import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterService } from '../../services/router.service';
import { SidenavService } from './sidenav.service';
import { PlayerService } from '../../services/player.service';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { BadgeDataService } from '../../services/badge.data.service';
import { MatDialog } from '@angular/material/dialog';
import { ContactUsComponent } from '../../modals/contact-us/contact-us.component';

export interface NavsModel {
  link?: string;
  label: string;
  icon: string;
  action?: () => void;
}
export interface NavGroupModel {
  name: string;
  navs: NavsModel[];
}

@Component({
  selector: 'pm-sidenav',
  standalone: true,
  imports: [
    TranslateModule,
    NgForOf,
    MatIconModule,
    MatRippleModule,
    MatListModule,
    MatBadgeModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  constructor(
    protected routerService: RouterService,
    protected sidenavService: SidenavService,
    protected playerService: PlayerService,
    protected badgeDataService: BadgeDataService,
    protected dialog: MatDialog
  ) {}

  protected navs: NavGroupModel[] = [
    {
      name: 'Home',
      navs: [
        {
          link: 'home',
          label: 'HOME',
          icon: 'home',
        },
      ],
    },
    {
      name: 'Trainer relative',
      navs: [
        {
          link: 'battle-strategy',
          label: 'BATTLE-STRATEGY',
          icon: 'military_tech',
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
      ],
    },
    {
      name: 'Game info',
      navs: [
        {
          link: 'history',
          label: 'HISTORY',
          icon: 'history',
        },
        {
          link: 'events',
          label: 'EVENTS',
          icon: 'event',
        },
        {
          link: 'trainers',
          label: 'TRAINERS',
          icon: 'groups',
        },
        {
          link: 'pokedex',
          label: 'POKEDEX',
          icon: 'devices',
        },
      ],
    },
    {
      name: 'Exit',
      navs: [
        {
          link: 'games',
          label: 'BACK_TO_MENU',
          icon: 'videogame_asset',
        },
        {
          link: 'login',
          label: 'LOGOUT',
          icon: 'logout',
          action: (): void => this.playerService.logout(),
        },
        {
          label: 'CONTACT-US',
          icon: 'alternate_email',
          action: (): void => {
            this.dialog.open(ContactUsComponent);
          },
        },
      ],
    },
  ];

  protected click(nav: NavsModel): void {
    if (nav.action) {
      nav.action();
    }
    this.badgeDataService.sidenav = this.badgeDataService.sidenav.filter(
      (el) => el !== nav.label
    );
    if (nav.link) {
      this.routerService.navigateByUrl(nav.link);
    }
    this.sidenavService.closeSidenav();
  }
}
