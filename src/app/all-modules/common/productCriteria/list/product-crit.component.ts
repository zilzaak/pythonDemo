import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-crit',
  templateUrl: './product-crit.component.html',
  styleUrls: ['./product-crit.component.css']
})
export class ProductCritComponent implements OnInit {

  listData:any[]=[];
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;

  roleList: any;
  username:any;
  entity:any;

  entities:any[]=['Brand','ProductCat','ProductModel','ProductColor','ProductSize','MadeWith','UnitOfMeasure'];

  constructor(private commonService:CommonServiceService,    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
 this.initForm();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      name:[''],
      orgId:[''],
      entity:['Brand']
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

  if(this.searchForm.value.orgId && this.searchForm.value.orgId!=null 
    && this.searchForm.value.orgId!==''
  ){
    params.orgId=this.searchForm.value.orgId;
  }

  if(this.searchForm.value.entity && this.searchForm.value.entity!=null 
    && this.searchForm.value.entity!==''
  ){
    params.entity=this.searchForm.value.entity;
  }
  if(this.searchForm.value.name && this.searchForm.value.name!=null 
    && this.searchForm.value.name!==''
  ){
    params.name=this.searchForm.value.name;
  }


    this.commonService.getWithToken('http://localhost:8000/setting/productCriteria/list', params)
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
