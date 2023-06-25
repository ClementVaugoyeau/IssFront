import { IssPosition } from './../services/iss-data.service';
import { Component, AfterViewInit, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ThreeGlobe from 'three-globe';
import { IssDataService } from '../services/iss-data.service';

@Component({
  selector: 'app-globe-iss',
  templateUrl: './globe-iss.component.html',
  styleUrls: ['./globe-iss.component.scss'],
})
export class GlobeIssComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  //* Cube Properties

  rotationSpeedX: number = 0.01;
  rotationSpeedY: number = 0.001;
  size: number = 200;

  //* Stage Properties

  cameraZ: number = 60;
  cameraY: number = 20;
  cameraX: number = 50;

  fieldOfView: number = 1;
  nearClippingPlane: number = 1;
  farClippingPlane: number = 1000000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  AmbiantLight = new THREE.AmbientLight(0xbbbbbb);
  DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private controls!: any;
  private loader = new GLTFLoader();

  //3D iss properties

  private N: number = 1;
  private IssLong: number = 180;

  public gData = [...Array(this.N).keys()].map(() => ({
    lat: (1 - 0.5) * 180,
    lng: (1 - 0.5) * 360,
    alt: 1 * 0.8 + 0.1,
    radius: 10,
    color: 'red',
  }));

  private Globe = new ThreeGlobe();

  private geometryISS: any;

  //variable for the service
  issLongitude: number = 0;
  issLatitude: number = 0;
  issCurrentPosition: any;

  private createScene() {

    this.scene = new THREE.Scene();

    this.loader.load(
      'https://clementvaugoyeau.github.io/IssFront/assets/issModel.glb',
      (gltf) => {
        this.geometryISS = gltf.scene.getObjectByName('iss');

        this.geometryISS.rotateZ( Math.PI / 2 );

          this.Globe
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .customLayerData(this.gData)
          .customThreeObject(this.geometryISS)
          .customThreeObjectUpdate((obj) => {
            Object.assign(
              obj.position,
              this.Globe.getCoords(this.issLatitude, this.issLongitude, 0.5),
              );
            });

          },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    //background color, color of space
    this.scene.background = new THREE.Color(0x00000);

    //light
    this.scene.add(this.AmbiantLight, this.DirectionalLight);
    this.scene.add(this.Globe);

    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.camera.position.z = 12000;




  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   *
   * @private
   * @memberof GlobeIssComponent
   */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    let component: GlobeIssComponent = this;
    (function render() {
      component.moveSpheres();
      requestAnimationFrame(render);

      component.renderer.render(component.scene, component.camera);
    })();
  }

  private moveSpheres() {
    this.IssLong += 0.1;
    this.Globe.customLayerData(this.Globe.customLayerData());
  }

  constructor(private issDataService: IssDataService) { }

  ngOnInit(): void {
    this.getIssPosition()
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

  getIssPosition() {
    this.issDataService.getIssPosition().subscribe(
      (resp) => {
        this.issLatitude = Number(resp.latitude);
        this.issLongitude = Number(resp.longitude);
        this.issCurrentPosition.setLatLng([
          this.issLatitude,
          this.issLongitude
        ]);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
