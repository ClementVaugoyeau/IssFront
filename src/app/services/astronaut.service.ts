import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AstronautService {

  constructor(private http: HttpClient) { }


  API = 'http://localhost:8081';


  public registerAstronaut(astronautData: any){
    return this.http.post(this.API + '/astronauts', astronautData)
  }

  public getAstronauts(){
    return this.http.get(this.API + '/astronauts')
  }


}
