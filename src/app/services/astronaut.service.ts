import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AstronautsInSpace } from '../list-astronauts/astronaut-list-response';

@Injectable({
  providedIn: 'root'
})
export class AstronautService {

  constructor(private http: HttpClient) { }


  API = 'http://localhost:8081';
  API_astronautsInSpace = 'http://api.open-notify.org/astros.json'


  public registerAstronaut(astronautData: any){
    return this.http.post(this.API + '/astronauts', astronautData)
  }

  public getAstronauts(){
    
    return this.http.get(this.API + '/astronauts')
  }

  public getAstronautOpenNotify() {
    return this.http.get<AstronautsInSpace>( this.API_astronautsInSpace)
  }
   
  
  public putAstronauts(astronautData: any, id: Number){
    return this.http.put(this.API + `/astronauts/${id}`, astronautData)
  }

  public DeleteAstronauts( id: Number){
    return this.http.delete(this.API + `/astronauts/${id}`)
  }


}
