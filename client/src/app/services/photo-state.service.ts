import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoStateService {
  private photos: any[] = [];
  private photos$ = new BehaviorSubject<any[]>(this.photos);
  constructor(
    private apiSrv: ApiService
  ) {
    this.apiSrv.getPhotos()
      .then(photos => {
        this.photos = photos;
        this.photos$.next(this.photos);
      }).catch(err => console.log(err));
   }

  get $photos(): Observable<any[]> {
    return this.photos$.asObservable();
  }
}
