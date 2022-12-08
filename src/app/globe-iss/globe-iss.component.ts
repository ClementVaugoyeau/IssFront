import { Component, AfterViewInit, ViewChildren, ElementRef, Renderer2, QueryList } from '@angular/core';
import Globe from 'globe.gl'
import * as THREE from 'three';



@Component({
  selector: 'app-globe-iss',
  templateUrl: './globe-iss.component.html',
  styleUrls: ['./globe-iss.component.scss']
})
export class GlobeIssComponent implements AfterViewInit {

  
  constructor(
    private _renderer: Renderer2,
    private globes: ElementRef
  ) { 
    
  }

  world: any;

  ngAfterViewInit(): void {

    const EARTH_RADIUS_KM = 6371; // km
      const SAT_SIZE = 100; // km
      const TIME_STEP = 3 * 1000; // per frame
  
      const timeLogger = document.getElementById('time-log');

      const N = 1;
    const gData = [{
      lat:  50,
      lng: 29,
      alt: 0.9,
      color: 'red'
    }];

    const satData = [{
      lat:  40,
      lng: 29,
      alt: 0.2,
      
    }];

    
    console.log(Math.random())
      this.world = Globe()
        
        .width(500)
        .height(500)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      
      
      .pointRadius(1)
      .objectLat('lat')
      .objectLng('lng')
      .objectAltitude('alt')
      .objectLabel('name')
      .pointColor('color')
      
  
      setTimeout(() => this.world.pointOfView({ altitude: 2.5 }));
  
      const satGeometry = new THREE.SphereGeometry(2);
      const satMaterial = new THREE.MeshLambertMaterial({ color: 'red'});
      this.world.objectThreeObject(() => new THREE.Mesh(satGeometry, satMaterial));

      
      
      this.world.objectsData(satData);
     console.log(this._renderer.selectRootElement(this.globes))
      this._renderer.selectRootElement(this.globes)

      const div = this._renderer.createElement('div');
      const text = this._renderer.createText('I am dynamically createdhhh');
      this._renderer.appendChild(div, text);
      this._renderer.appendChild(this.globes.nativeElement, div);
    
        // document.addEventListener("DOMContentLoaded", () => {
        //   alert("DOM ready!");
        //   this.initGlobe();
          
        // });       
   
  }

  // private initGlobe(): void {
  //   console.log(this.world)
  //   console.log(typeof(this.world))
  //   this.world(document.getElementById('chart'))
      
  // }
  

    

     
    
    
   
  

  

}
