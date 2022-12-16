import { Component, OnInit } from '@angular/core';
import { AstronautService } from '../services/astronaut.service';
import {MatTableModule} from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { SharedService } from '../services/shared.service';
import { Subscription,  Observable, of, pipe } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { AstronautsInSpace } from './astronaut-list-response';




@Component({
  selector: 'app-list-astronauts',
  templateUrl: './list-astronauts.component.html',
  styleUrls: ['./list-astronauts.component.scss']
})
export class ListAstronautsComponent implements OnInit    {
  title = "astronautList"

  astronautsDetails = null as any
  astronautArrayAPIRep: any = [];

  isLocalAPIOn = true;


  index = 1;

  displayedColumns: string[] = ['No', 'name', 'role', 'nationality', 'actions'];

  items = ['Liste des astronautes'];
  expandedIndex = 0;

  getAstronautEventsubcription: Subscription;

  astronautModel!: AstronautsInSpace;


  constructor(private astronautService: AstronautService, private sharedService: SharedService) {

    
      
    


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
    this.astronautService.getAstronauts().subscribe({
      next: (v) => {
        console.log(v)
        this.astronautsDetails = v
      },
      error: (e) => {
        console.error("local server not responding getting astronaut list from OpenAPI", e)
        this.isLocalAPIOn = false;
        this.displayedColumns.pop() //delete actons of displayed column
        
        this.astronautService.getAstronautOpenNotify().subscribe({

          next: (v) => {

            this.PutResponseIntoArray(v);
          },
        })


      },



    });

  }
  
  private PutResponseIntoArray(v: AstronautsInSpace) {
    this.astronautArrayAPIRep = v.people;

    this.astronautsDetails = this.astronautArrayAPIRep.filter((obj: any) => {
      return obj.craft === "ISS";
    });
    let i = 0; //index to change the role and nationality manually
    
    for (let element of this.astronautsDetails) {

      if (i == 0) {
        element.role = "Capitaine";
      }
      else {
        element.role = "Astronaute";
      }
      i++;

    }
     i = 0
    for (let element of this.astronautsDetails) {

      if (i <= 1 || i == 6) {
        element.nationality = "Russe 🇷🇺";
      }
      else if(i == 5) {
        element.nationality = "Japonaise 🇯🇵";
      }
      else{
         element.nationality = 'Américaine 🇺🇸'
      }
      i++;

    }
    console.log(this.astronautsDetails);
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
