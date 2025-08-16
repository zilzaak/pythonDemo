import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {


  listData:any[]=[];
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  constructor(private commonService:CommonServiceService,    private formBuilder: FormBuilder,) { }

 ngOnInit(): void {
 this.initForm();
 this.getListData();
  }

  initForm(){
   this.searchForm=this.formBuilder.group({
      username:[null]
    })
  }

  getListData(){
    let apiUrl=this.baseUrl+"/base/organization/list";
    let params=this.searchForm.value;
    if(this.searchForm.get("username")?.value==null){
      params={};
    }

    this.commonService.getWithToken(apiUrl, params)
    .subscribe({
      next: (response) => {
        this.listData = response?.data?.listData || [];
        console.log("Received listData:", this.listData);
      },
      error: (err) => {
        console.error('Error:', err);
        this.listData = []; 
      }
    });


      console.log("response list data is ")
      console.log(this.listData)
  }


}
