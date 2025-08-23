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

  loading = false;
  loadingDropdown = false;
  currentPage1 = 1;
  pageSize1 = 10;    
  hasMore = true; 
  menuOptions:any[]=[];
  urlOptions:any[]=[];
  userOptions:any[]=[];
  private debounceTimer: any;
  roleList: any;
  username:any;

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

    this.commonService.getWithToken('http://localhost:8000/base/module/list', params)
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

  onSearch(event: any,menu:any): void {
    const term = event.term?.trim();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (!term || term.length === 0) {
      if(menu==='menu'){
        this.menuOptions = [];
      }
      if(menu==='url'){
this.urlOptions=[];
      }
           return;
    }
    this.debounceTimer = setTimeout(() => {
      if(menu==='menu'){
        this.currentPage1 = 1;
        this.hasMore = true;
      }
      this.performSearch(term,menu);
    }, 300);
  }


  loadMore(menu:any): void {
    if (!this.hasMore || this.loadingDropdown) return;

    const term = this.searchForm.get('menu')?.value?.trim();
    if (!term || typeof term !== 'string') return;
    this.currentPage1++;
    this.loadingDropdown = true;

   let params: any;
   if(menu==='menu'){
    params= { menu: term,  
      menuSearch:"menuSearch",
      pageNum: this.currentPage1.toString(),
       pageSize: this.pageSize1.toString(),
      }
   }
   if(menu==='url'){
    params= { menu: term,  
      pageNum: this.currentPage1.toString(),
       pageSize: this.pageSize1.toString(),
       loadMethod:"loadMethod"
      }
   }

    let uri=this.baseUrl+"/base/module/list";
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(menu==='menu'){
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize1;
        }
        this.loadingDropdown = false;
      },
      error: (err) => {
        this.loadingDropdown = false; 
      }
    });
  }



  private performSearch(term: string,menu:any): void {
        if(menu==='menu'){
      this.loadingDropdown = true;
    }

    let uri=this.baseUrl+"/base/module/list";
   
    let params: any;
    if(menu==='menu'){
      params={
        menu: term,
        menuSearch:"menuSearch",
        pageNum: this.currentPage.toString(),
        pageSize: this.pageSize.toString()
      }
    }
    if(menu==='url'){
      params={
        menu: term,
        loadMethod:"loadMethod",
        pageNum: this.currentPage.toString(),
        pageSize: this.pageSize.toString()
      }
    }

    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(menu==='menu'){
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
          this.loadingDropdown = false; 
        }
        if(menu==='url'){
          this.urlOptions = response?.data?.listData || [];
          this.hasMore = this.urlOptions.length === this.pageSize;
          this.loadingDropdown = false; 
        }
      },
      error: (err) => {
        this.loadingDropdown = false; 
      }
    });
  }
  setUser(){
    for(let k of this.userOptions){
    if(k.userId===this.searchForm.value.userId){
    this.username=k.username;
     break;
    }
    }
      }


}
