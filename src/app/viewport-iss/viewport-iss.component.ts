import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
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
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'



@Component({
  selector: 'app-viewport-iss',
  templateUrl: './viewport-iss.component.html',
  styleUrls: ['./viewport-iss.component.scss'],
})
export class ViewportIssComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  //* Cube Properties

  public rotationSpeedX: number = 0.01;

  public rotationSpeedY: number = 0.001;

  public size: number = 200;

  public texture: string = '/assets/texture.jpg';

  public issModel: string =
    '/assets/iss-_international_space_station.glb';

  //* Stage Properties


  public cameraZ: number = 60;
  public cameraY: number = 20;
  public cameraX: number = 50;
  public fieldOfView: number = 1;
  public nearClippingPlane: number = 1;
  public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private AmbiantLight = new THREE.AmbientLight(0x404040, 1);
  private DirectionaLight = new THREE.PointLight(0x404040, 7);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private IssScene!: THREE.Group;
  private controls!: any;
  private loader = new GLTFLoader();
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private selectedObjects: any = [];
  private outlinePass: any;
  private composer: any;
  private effectFXAA: any;




  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9fc4ce);

    this.DirectionaLight.position.x = 10;
    this.DirectionaLight.position.y = 20;
    this.scene.add(this.DirectionaLight, this.AmbiantLight);




    // 'https://clementvaugoyeau.github.io/IssFront/assets/iss-_international_space_station.glb'

    this.loader.load(
      'assets/issModelPerso.glb',
      (gltf) => {
        this.scene.add(gltf.scene);

        this.IssScene = gltf.scene;
        this.IssScene.scale.x = 10;
        this.IssScene.scale.y = 10;
        this.IssScene.scale.z = 10;
        this.IssScene.position.y = -0.3;


      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
    //*Camera
    let aspectRatio = this.getAspectRatio();

    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
    this.camera.position.y = this.cameraY;
    this.camera.position.x = this.cameraX;




  }

   onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

      this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
    this.composer.setSize( width, height );

    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
   }


  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private renderComposer() {
    this.composer.render()
  }


  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);

    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);




    this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    this.outlinePass.edgeStrength = 10.0;

    this.outlinePass.edgeGlow = 0;
    this.outlinePass.edgeThickness = 4.0;
    this.outlinePass.pulsePeriod = 0;
    this.outlinePass.usePatternTexture = false; // patter texture for an object mesh
    this.outlinePass.visibleEdgeColornew = new THREE.Color( 0, 0, 0 );
    this.outlinePass.hiddenEdgeColor.set("#1abaff"); // set edge color when it hidden by other objects
    this.outlinePass.overlayMaterial.blending = THREE.SubtractiveBlending
    this.composer.addPass(this.outlinePass);



    this.effectFXAA = new ShaderPass(FXAAShader);
    this.effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    this.effectFXAA.renderToScreen = true;
    this.composer.addPass(this.effectFXAA);





    let component: ViewportIssComponent = this;
    (function render() {
      requestAnimationFrame(render);

      component.renderer.render(component.scene, component.camera);
      component.renderComposer()
    })();

  }

  onDocumentMouseDown(event: any) {

    event.preventDefault();



    this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;


    this.raycaster.setFromCamera(this.mouse, this.camera);


    const intersects = this.raycaster.intersectObject(this.scene, true);

    console.log(intersects)



    if (intersects.length > 0) {

      const selectedObject = intersects[0].object;
      console.log(selectedObject)
      this.selectedObjects = [];
      this.selectedObjects.push(selectedObject)
      console.log(this.selectedObjects)

      this.outlinePass.selectedObjects = this.selectedObjects




    }else{
      this.outlinePass.selectedObjects = []
    }



  }





  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();



  }
}
