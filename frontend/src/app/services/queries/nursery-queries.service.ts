import { Injectable } from '@angular/core';
import { NurseryModel, WishListModel } from '../../models/nursery.model';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class NurseryQueriesService extends ReadonlyQuery<NurseryModel> {
  public static readonly url = 'api/nursery';
  public constructor(protected override http: HttpClient) {
    super(NurseryQueriesService.url, http);
  }

  public setNurseryWishlist(
    wishlist: WishListModel,
    nurseryId: string,
    trainerId: string
  ): Observable<UserModel> {
    return this.http.post<UserModel>(this.url, {
      wishlist,
      nurseryId,
      trainerId,
    });
  }

  public saveNurseryWishlist(
    wishlist: WishListModel,
    nurseryId: string
  ): Observable<UserModel> {
    return this.http.put<UserModel>(this.url, {
      wishlist,
      nurseryId,
    });
  }
}
