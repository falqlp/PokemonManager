import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { PokemonInfoComponent } from 'src/app/modals/pokemon-info/pokemon-info.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { Router } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  protected player$: Observable<TrainerModel>;
  protected goHomeDisabled$: Observable<boolean>;
  protected title$: Observable<string>;
  protected date$: Observable<string>;

  constructor(
    protected playerService: PlayerService,
    protected dialog: MatDialog,
    protected router: Router,
    protected routerService: RouterService,
    protected timeService: TimeService
  ) {}

  public ngOnInit(): void {
    this.player$ = this.playerService.player$;
    this.goHomeDisabled$ = this.routerService.goHomeDisabled();
    this.title$ = this.routerService.getTitle();
    this.date$ = this.timeService.getActualDate();
  }

  protected openInfo(pokemon: PokemonModel): void {
    this.dialog.open(PokemonInfoComponent, { data: pokemon });
  }

  protected goHome(): void {
    this.router.navigate(['home']);
  }

  protected simulate(): void {
    this.timeService.simulateDay();
  }
}
