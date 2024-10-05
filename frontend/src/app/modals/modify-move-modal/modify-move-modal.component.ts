import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PokemonSummaryModifyMovesComponent } from '../../components/pokemon-resume/pokemon-resume-moves/pokemon-resume-modify-moves/pokemon-summary-modify-moves.component';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'pm-modify-move-modal',
  standalone: true,
  imports: [MatDialogModule, PokemonSummaryModifyMovesComponent],
  templateUrl: './modify-move-modal.component.html',
  styleUrl: './modify-move-modal.component.scss',
})
export class ModifyMoveModalComponent {
  data = inject<PokemonModel>(MAT_DIALOG_DATA);
  protected dialogRef =
    inject<MatDialogRef<ModifyMoveModalComponent>>(MatDialogRef);

  protected close(): void {
    this.dialogRef.close();
  }
}
