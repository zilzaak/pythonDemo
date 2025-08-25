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
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;

  constructor(private commonService:CommonServiceService,    private formBuilder: FormBuilder,) { }

 ngOnInit(): void {
 this.initForm();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      parentMenuId:[''],
      backendUrl:[''],
      frontendUrl:['']
    })
  }

  getPageRange(): number[] {
    const maxVisiblePages = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    const range = [];
  
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  
    return range;
  }

  loadPage(page: number) {
  if (page < 1 ) return;

  this.currentPage = page;
  let params:any;
  params = {
    pageNum: page.toString(),
    pageSize: this.pageSize.toString()
  };
  console.log("form value is ");
  console.log( this.searchForm.value);
  if(this.searchForm.value.parentMenuId && this.searchForm.value.parentMenuId!=null 
    && this.searchForm.value.parentMenuId!==''
  ){
    params.parentMenuId=this.searchForm.value.parentMenuId;
  }

  if(this.searchForm.value.backendUrl && this.searchForm.value.backendUrl!=null 
    && this.searchForm.value.backendUrl!==''
  ){
    params.backendUrlId=this.searchForm.value.backendUrl;
  }

  if(this.searchForm.value.frontendUrl && this.searchForm.value.frontendUrl!=null 
    && this.searchForm.value.frontendUrl!==''
  ){
    params.frontendUrl=this.searchForm.value.frontendUrl;
  }

    this.commonService.getWithToken('http://localhost:8000/base/organization/list', params)
      .subscribe({
        next: (response) => {
          this.listData = response.data.listData || [];
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
          this.totalItems = response.data.totalItems;
          this.pageSize = response.data.pageSize;
        },
        error: (err) => {
          console.error('Failed to load module list', err);
        }
      });
  }


  reset() {
    this.searchForm.reset();
    this.loadPage(1);
  }


  getList(){
   this.loadPage(this.currentPage);
  }


}
