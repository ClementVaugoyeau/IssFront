import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


export interface IssPosition {
  timestamp: string,
  iss_position: {longitude: string, latitude: string},
  
}

@Injectable({
  providedIn: 'root'
})
export class IssDataService {

  constructor(private http: HttpClient) { }


  API = 'http://api.open-notify.org/iss-now.json';
  // API = 'https://api.wheretheiss.at/v1/satellites/25544';



  public getIssPosition(): Observable<IssPosition>{
    return this.http.get<IssPosition>(this.API)
  }


}
