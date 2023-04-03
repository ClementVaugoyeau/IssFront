import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private subject = new Subject<any>();

  sendGetAstronaut() {
    this.subject.next(void 0);
  }

  getAstronaut(): Observable<any> {
    return this.subject.asObservable();
  }
}
