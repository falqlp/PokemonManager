import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { PokemonInfoComponent } from 'src/app/modals/pokemon-info/pokemon-info.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  protected player$: Observable<TrainerModel>;

  constructor(
    protected playerService: PlayerService,
    protected dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.player$ = this.playerService.player$;
  }

  protected openInfo(pokemon: PokemonModel): void {
    this.dialog.open(PokemonInfoComponent, { data: pokemon });
  }
}
