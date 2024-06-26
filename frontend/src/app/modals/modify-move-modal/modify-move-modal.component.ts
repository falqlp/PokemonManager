import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PokemonResumeModifyMovesComponent } from '../../components/pokemon-resume/pokemon-resume-moves/pokemon-resume-modify-moves/pokemon-resume-modify-moves.component';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'pm-modify-move-modal',
  standalone: true,
  imports: [MatDialogModule, PokemonResumeModifyMovesComponent],
  templateUrl: './modify-move-modal.component.html',
  styleUrl: './modify-move-modal.component.scss',
})
export class ModifyMoveModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: PokemonModel,
    protected dialogRef: MatDialogRef<ModifyMoveModalComponent>
  ) {}

  protected close(): void {
    this.dialogRef.close();
  }
}
