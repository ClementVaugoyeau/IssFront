import { Component, AfterViewInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IssDataService } from '../services/iss-data.service';
import * as L from 'leaflet';

import {Subscription, timer} from 'rxjs'; 
import { map } from 'rxjs/operators'; 



@Component({
  selector: 'app-map-iss',
  templateUrl: './map-iss.component.html',
  styleUrls: ['./map-iss.component.scss']
})
export class MapIssComponent implements AfterViewInit {

  //property for timer to refresh get Iss Position function
   subscription !: Subscription;

   worldMap: any;
   issLongitude:number = 0
   issLatitude:number = 0; 
   issCurrentPosition = L.marker;

   markerIcon = L.icon({
    iconUrl: 'marker-icon.png',
    

   })
   
   

   

  private initMap(): void {
    this.worldMap = L.map('map', {
      center: [ 30.8282, 0.5795 ],
      zoom: 1
    });
  }
  
  
  
  tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 0,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    
  
    constructor(private issDataService: IssDataService,  ) { }

  

  ngAfterViewInit(): void {
    
    this.initMap();
    this.tiles.addTo(this.worldMap)
    // timer 10000 = 10s
    this.subscription = timer(0, 10000).pipe( 
      map(() => { 
        this.getIssPosition(); 
      }) 
    ).subscribe();
    
    
  }

  ngOnDestroy(): void { 
    this.subscription.unsubscribe(); 
  }

  getIssPosition() {

   

    this.issDataService.getIssPosition().subscribe(
      (resp) => {
        console.log(resp);
       
        this.issLatitude = Number(resp.iss_position.latitude);
        this.issLongitude = Number(resp.iss_position.longitude)
        console.log(this.issLongitude)
        console.log(this.issLatitude)
        
        this.issCurrentPosition([this.issLatitude, this.issLongitude], {icon: this.markerIcon}).addTo(this.worldMap);
        
        
       
        
      },
      (err) => {
        console.log(err)
      }
    )
  }

}
