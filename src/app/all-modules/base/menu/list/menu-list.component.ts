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
    let apiUrl=this.baseUrl+"/base/module/list";
    const params = {
      moduleId: '66',
      pageNum: '1',
      pageSize: '10'
    };

    return this.commonService.getWithToken(
      'http://localhost:8000/base/module/list',
      params
    ).subscribe({
      next: (response) => {
       console.log('Module list:', response);
      },
      error: (err) => {
        console.error('Failed to load module list', err);
      }
    });
  }



}
