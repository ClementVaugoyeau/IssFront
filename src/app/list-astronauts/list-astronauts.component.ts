import { Component, OnInit } from '@angular/core';
import { AstronautService } from '../services/astronaut.service';
import {MatTableModule} from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-list-astronauts',
  templateUrl: './list-astronauts.component.html',
  styleUrls: ['./list-astronauts.component.scss']
})
export class ListAstronautsComponent implements OnInit    {
  title = "astronautList"

  astronautsDetails = null as any
  astronautsToUpdate = {
    name:"",
    role:"",
    nationality:""
  }

  index = 1;

  displayedColumns: string[] = ['No', 'name', 'role', 'nationality'];

 

  constructor(private astronautService: AstronautService) { }

  ngOnInit(): void {

      this.getAstronautDetails();
      
  }

  getAstronautDetails() {
    this.astronautService.getAstronauts().subscribe(
      (resp) => {
        console.log(resp);
        this.astronautsDetails = resp;
      },
      (err) => {
        console.log(err)
      }
    )
  }

}
