import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AstronautService } from '../services/astronaut.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  // @ts-ignore
   astronautFromGroup: FormGroup;

   loading = false;
   success = false;

  constructor(private fb: FormBuilder, private astronautService: AstronautService, private sharedService:SharedService) { }

  ngOnInit(): void {
    this.astronautFromGroup = this.fb.group({
      name: '',
      role: '',
      nationality: ''

    });
    
    this.astronautFromGroup.valueChanges.subscribe(console.log)

  }

 submitNewAstronaut() {
   this.loading = true

   const formValue = this.astronautFromGroup.value

   this.astronautService.registerAstronaut(formValue).subscribe(
    (resp) => {
      console.log(resp);
      this.success = true
      this.sharedService.sendGetAstronaut();
   
      
    },
    (err) => {
      console.log(err)
    }
  )

   this.loading = false
  

 }

 
  
 

}
