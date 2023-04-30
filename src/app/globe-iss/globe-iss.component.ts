import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ThreeGlobe from 'three-globe';

@Component({
  selector: 'app-globe-iss',
  templateUrl: './globe-iss.component.html',
  styleUrls: ['./globe-iss.component.scss'],
})
export class GlobeIssComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  //* Cube Properties

  @Input() public rotationSpeedX: number = 0.01;

  @Input() public rotationSpeedY: number = 0.001;

  @Input() public size: number = 200;

  @Input() public texture: string = '/assets/texture.jpg';

  @Input() public issModel: string =
    '/assets/iss-_international_space_station.glb';

  //* Stage Properties

  @Input() public cameraZ: number = 60;
  @Input() public cameraY: number = 20;
  @Input() public cameraX: number = 50;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private Texloader = new THREE.TextureLoader();

  private material = new THREE.MeshStandardMaterial({
    color: 0x479e9e,
    wireframe: false,
  });
  private AmbiantLight = new THREE.AmbientLight(0xbbbbbb);
  private DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private IssScene!: any;
  private Iss3DObject!: any;

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




  /**
   *Animate the cube
   *
   * @private
   * @memberof GlobeIssComponent
   */

  /**
   * Create the scene
   *
   * @private
   * @memberof GlobeIssComponent
   */
  private createScene() {
    this.scene = new THREE.Scene();

    this.loader.load(
      '/assets/iss_model.glb',
      (gltf) => {
        this.geometryISS = gltf.scene.getObjectByName('iss');
        console.log(this.geometryISS);

        // this.scene.add(gltf.scene);

        this.Globe.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .customLayerData(this.gData)
          .customThreeObject(this.geometryISS)
          .customThreeObjectUpdate((obj) => {
            Object.assign(
              obj.position,
              this.Globe.getCoords(180, this.IssLong, 1)
            );
          });
      },

    );

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

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }
}
