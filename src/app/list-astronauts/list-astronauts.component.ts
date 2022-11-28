import { Component, OnInit } from '@angular/core';
import { AstronautService } from '../services/astronaut.service';
import {MatTableModule} from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-list-astronauts',
  templateUrl: './list-astronauts.component.html',
  styleUrls: ['./list-astronauts.component.scss']
})
export class ListAstronautsComponent implements OnInit    {
  title = "astronautList"

  astronautsDetails = null as any


  index = 1;

  displayedColumns: string[] = ['No', 'name', 'role', 'nationality', 'actions'];

  items = ['Liste des astronautes'];
  expandedIndex = 0;

  getAstronautEventsubcription:Subscription;
 

  constructor(private astronautService: AstronautService, private sharedService:SharedService) { 

    this.getAstronautEventsubcription = this.sharedService.getAstronaut().subscribe(() => {
      this.getAstronautDetails();
    })
  }

  ngOnInit(): void {

      this.getAstronautDetails();
      
  }

  onEdit(item: any) {
    
    this.astronautsDetails.forEach((element: { isEdit: boolean; }) => {
      element.isEdit = false;
    });
    item.isEdit = true;
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

  updateAstronaut(element: any) {
    
    let astronautsToUpdate = {
      "name": element.name,
      "role": element.role,
      "nationality": element.nationality

    }
   

    this.astronautService.putAstronauts(astronautsToUpdate, element.id).subscribe(
      (resp) => {
       
        this.getAstronautDetails()
        
      },
      (err) => {
        console.log(err)
      }
    )
  }

  deleteAstronaut(element: any) {
    
    this.astronautService.DeleteAstronauts(element.id).subscribe(
      (resp) => {
       
        this.getAstronautDetails()
        
      },
      (err) => {
        console.log(err)
      }
    )
  }

  

  

}
