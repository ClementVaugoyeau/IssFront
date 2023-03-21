import { Component, AfterViewInit, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-viewport-iss',
  templateUrl: './viewport-iss.component.html',
  styleUrls: ['./viewport-iss.component.scss']
})
export class ViewportIssComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;
  
  //* Cube Properties

  @Input() public rotationSpeedX: number = 0.01;

  @Input() public rotationSpeedY: number = 0.001;

  @Input() public size: number = 200;

  @Input() public texture: string = "/assets/texture.jpg";

  @Input() public issModel: string = "/assets/iss-_international_space_station.glb";


  //* Stage Properties

  @Input() public cameraZ: number = 60;
  @Input() public cameraY: number = 20;
  @Input() public cameraX: number = 50;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private Texloader = new THREE.TextureLoader();
 
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshStandardMaterial({color: 0x479e9e, wireframe:false})
  private AmbiantLight = new THREE.AmbientLight( 0x404040, 1 );
  private DirectionaLight = new THREE.PointLight( 0x404040, 7 );
  private DLighthelper = new THREE.PointLightHelper( this.DirectionaLight, 5 );


  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private IssScene!: THREE.Group;

  private controls!: any;

  private loader = new GLTFLoader();

   

  /**
   *Animate the cube
   *
   * @private
   * @memberof ViewportIssComponent
   */
 

  /**
   * Create the scene
   *
   * @private
   * @memberof ViewportIssComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9fc4ce)
    
   this.DirectionaLight.position.x = 10
   this.DirectionaLight.position.y = 20
    this.scene.add(this.DirectionaLight, this.AmbiantLight)


    this.loader.load( "../assets/iss-_international_space_station.glb",  ( gltf ) => {
    
    this.scene.add(gltf.scene)
 

    this.IssScene = gltf.scene;
    this.IssScene.scale.x = 10;
    this.IssScene.scale.y = 10;
    this.IssScene.scale.z = 10;
    this.IssScene.position.y = -0.3
    
    
    // console.log(gltf.scene.position)
    // console.log(gltf.scene)
    

  }, undefined, function ( error ) {

    console.error( error );

  } );
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
    this.camera.position.y = this.cameraY;
    this.camera.position.x = this.cameraX;


    
  }

  // private animateIss() {
  //   this.IssScene.rotation.y += this.rotationSpeedY;
   
  // }



  

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
 * Start the rendering loop
 *
 * @private
 * @memberof ViewportIssComponent
 */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    
    
    let component: ViewportIssComponent = this;
    (function render() {
      requestAnimationFrame(render);
      // component.animateIss();
      component.renderer.render(component.scene, component.camera);
      
    }());
  }
  
  

  constructor() { }
  


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
    
  }

}
