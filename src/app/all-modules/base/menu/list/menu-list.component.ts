import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  listData:any;
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  constructor(private commonService:CommonServiceService,    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
 this.initForm();
 this.getListData();
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      parentModule:[''],
      childModule:[''],
      apiPattern:['']
    })
  }

  getListData(){
    let queryParams={};
    let apiUrl=this.baseUrl+"/base/module/list";
    this.commonService.sendGetRequest(apiUrl,queryParams).subscribe(
      (response: any) => {
console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
console.log(response)

     },
     (error) => {
       alert('Invalid username or password');
     });

  }

}
