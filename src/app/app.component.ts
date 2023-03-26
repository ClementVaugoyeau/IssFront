import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { NgComponentOutlet } from '@angular/common';
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';

import { Platform } from '@angular/cdk/platform';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IssFront';

  constructor(
    private overlay: Overlay,
    private positionBuilder: OverlayPositionBuilder,
    public platform: Platform,
    private breakpointObserver: BreakpointObserver,



  ){}
  
  ngOnInit(): void {
    if(this.breakpointObserver.isMatched('(max-width: 600px)')){
    console.info("the current screen size is set to 600px")
    }
  }
}

