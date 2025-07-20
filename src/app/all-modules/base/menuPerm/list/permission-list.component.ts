import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css']
})
export class PermissionListComponent implements OnInit {

    listData:any;
    searchForm!:FormGroup;
    formBuilder!:FormBuilder;
    role:any;

   constructor(private commonService:CommonServiceService,
    private fromBuilder:FormBuilder
   ) {


   }


  ngOnInit(): void {
   this.initializeForm();
   this.loadRoles();
  }

    initializeForm(){
      this.searchForm = this.formBuilder.group({
        user: [''],
        role: ['']
      });
    }

    loadRoles(){

    }

}
