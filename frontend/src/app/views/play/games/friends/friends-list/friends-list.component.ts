import { Component, inject, Input } from '@angular/core';
import { UserModel } from '../../../../../models/user.model';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AddGameComponent } from '../../add-game/add-game.component';

@Component({
  selector: 'pm-friends-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './friends-list.component.html',
  styleUrl: './friends-list.component.scss',
})
export class FriendsListComponent {
  private dialog = inject(MatDialog);

  @Input() public user: UserModel;

  protected invite(user: UserModel): void {
    this.dialog.open(AddGameComponent, { data: { friendId: user._id } });
  }
}
