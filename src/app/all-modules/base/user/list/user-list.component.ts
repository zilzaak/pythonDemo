import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  listData:any[]=[];
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  constructor(private commonService:CommonServiceService,    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
 this.initForm();
 this.loadPage(this.currentPage);
  }

  initForm(){
   this.searchForm=this.formBuilder.group({
    username:[null],
    commonField:[null]
    })
  }

  getList(){
    this.loadPage(this.currentPage);
    }

  loadPage(page: number) {
    if (page < 1 ) return;
  
    this.currentPage = page;
    let params:any={};
     params.pageNum= page.toString();
     params.pageSize=this.pageSize.toString();
    
    if(this.searchForm.value.username && 
      this.searchForm.value.username!=null && this.searchForm.value.username!==''){
      params.username=this.searchForm.value.username;
    }
    if(this.searchForm.value.commonField && 
      this.searchForm.value.commonField!=null && this.searchForm.value.commonField!==''){
      params.commonField=this.searchForm.value.commonField;
    }
    console.log("search form vaue is ");
    console.log(this.searchForm.value);
    console.log("params vaue is ");
    console.log(params);
    let apiUrl=this.baseUrl+"/base/user/list";
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
    }
  

}
