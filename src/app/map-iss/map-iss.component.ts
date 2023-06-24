import { Component, AfterViewInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IssDataService } from '../services/iss-data.service';
import * as L from 'leaflet';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map-iss',
  templateUrl: './map-iss.component.html',
  styleUrls: ['./map-iss.component.scss'],
})
export class MapIssComponent implements AfterViewInit {
  //property for timer to refresh get Iss Position function
  subscription!: Subscription;

  worldMap: any;
  issLongitude: number = 0;
  issLatitude: number = 0;
  markerIcon = L.icon({
    iconUrl: 'assets/iss-icon.png',
    iconSize: [35, 70],
    iconAnchor: [22, 70],
    popupAnchor: [-3, -76],

    shadowSize: [68, 95],
    shadowAnchor: [22, 94],
  });
  issCurrentPosition: any;
   polylinePoints:any = [];

  markerCreated = false;

  private initMap(): void {
    this.worldMap = L.map('map', {
      center: [30.8282, 0.5795],
      zoom: 1,
    });
  }

  tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 0,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

  constructor(private issDataService: IssDataService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.issCurrentPosition = L.marker([this.issLatitude, this.issLongitude], {
      icon: this.markerIcon,

    }).addTo(this.worldMap);
    this.tiles.addTo(this.worldMap);


    // timer 10000 = 10s
    this.subscription = timer(0, 10000)
      .pipe(
        map(() => {
          this.getIssPosition();
          console.log(this.polylinePoints)
          var polyline = L.polyline(this.polylinePoints, {color: 'blue'}).addTo(this.worldMap);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getIssPosition() {
    this.issDataService.getIssPosition().subscribe(
      (resp) => {
        this.issLatitude = Number(resp.latitude);
        this.issLongitude = Number(resp.longitude);
        this.issCurrentPosition.setLatLng([
          this.issLatitude,
          this.issLongitude,
        ]);
        this.polylinePoints.push([this.issLatitude, this.issLongitude]);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
