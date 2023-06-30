import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { AstronautService } from '../services/astronaut.service';
import { SharedService } from '../services/shared.service';
import { Subscription,  Observable, of, pipe } from 'rxjs';
import { AstronautsInSpace } from './astronaut-list-response';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-list-astronauts',
  templateUrl: './list-astronauts.component.html',
  styleUrls: ['./list-astronauts.component.scss']
})
export class ListAstronautsComponent implements OnInit {

  title = "astronautList";
  displayedColumns: string[] = ['No', 'name', 'role', 'nationality', 'actions'];
  items = ['Liste des astronautes à bord de la station'];

  astronautsDetails = null as any
  astronautArrayAPIRep: any = [];

  isLocalAPIOn = true;
  getAstronautEventsubcription: Subscription;

  safeUrl: SafeResourceUrl = ""
  safeUrls: SafeResourceUrl[] = []

  isPreviewVisible: boolean[] = [];





  constructor(private astronautService: AstronautService, private sharedService: SharedService, private sanitizer: DomSanitizer) {




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

        this.astronautsDetails = v
      },
      error: (e) => {
        console.warn("local server not responding getting astronaut list from OpenAPI", e)
        this.isLocalAPIOn = false;
        this.displayedColumns.pop() //delete actions of displayed column

        this.astronautService.getAstronautOpenNotify().subscribe({

          next: (v) => {
            console.log(v)
           this.PutResponseIntoArray(v);
          },
        })
      },
    });
  }

  private PutResponseIntoArray(v: AstronautsInSpace) {
    for (let index = 0; index < v.people.length; index++) {
         if(v.people[index].iss == true){


          this.astronautArrayAPIRep.push(v.people[index]);
          this.safeUrls.push(v.people[index].url)

         }
    }
    this.safeUrl = this.safeUrls[0]


    this.astronautsDetails = this.astronautArrayAPIRep


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
  }

  showPreview(index: number) {
    this.isPreviewVisible[index] = true;
    console.log("hover")
  }

  hidePreview(index: number) {
    this.isPreviewVisible[index] = false;
  }

  



 updateAstronaut(element: any) {

    let astronautsToUpdate = {
      "name": element.name,
      "role": element.role,
      "nationality": element.country
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
