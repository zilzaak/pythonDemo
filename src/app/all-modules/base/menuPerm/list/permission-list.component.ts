import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css']
})
export class PermissionListComponent implements OnInit {


  listData:any[]=[];
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
  userOptions:any[]=[];
  private debounceTimer: any;
  roleList: any;
  searchForm!: FormGroup;

  private debounceTimer3: any;
  loading3 = false;
  loadingDropdown3 = false;
  currentPage3 = 1;
  pageSize3 = 10;    
  hasMore3 = true; 
  username: any;

  constructor(private commonService:CommonServiceService,   
     private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
 this.initForm();
 this.fetchRoles();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      userId:[''],
      roleId:[''],
      menuId:['']
    });
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

  getList(){
  this.loadPage(this.currentPage);
  }

  fetchRoles() {
    let api=this.baseUrl+"/base/role/list"
    this.commonService.getWithToken(api,{}).subscribe(
      { next: (response) => {
        this.roleList = response?.data?.listData;
        console.log("==========================")
        console.log(this.roleList)
        },
        error: (err) => {
        }
      }
    )
  }

  loadPage(page: number) {
  if (page < 1 ) return;

  this.currentPage = page;
  let params:any = {
    pageNum: page.toString(),
    pageSize: this.pageSize.toString()
  };

  if(this.searchForm.value.roleId && this.searchForm.value.roleId!=null && this.searchForm.value.roleId!==''){
    params.roleId=this.searchForm.value.roleId;
  }
  if(this.searchForm.value.userId && this.searchForm.value.userId!=null && this.searchForm.value.userId!==''){
    params.userId=this.searchForm.value.userId;
  }
  if(this.searchForm.value.menuId && this.searchForm.value.menuId!=null && this.searchForm.value.menuId!==''){
    params.menuId=this.searchForm.value.menuId;
  }

  console.log("search form vaue is ");
  console.log(this.searchForm.value);
  console.log("params vaue is ");
  console.log(params);

    this.commonService.getWithToken('http://localhost:8000/base/permittedModule/list', params)
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


  onSearch(event: any,menu:any): void {
    const term = event.term?.trim();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (!term || term.length === 0) {
      if(menu==='menu'){
        this.menuOptions = [];
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
   let params: any={ menu: term,  
    pageNum: this.currentPage1.toString(),
     pageSize: this.pageSize1.toString(),
     loadMethod:"loadMethod"
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
    let params: any={
      menu: term,
      loadMethod:"loadMethod",
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    }
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(menu==='menu'){
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
          this.loadingDropdown = false; 
        }
      },
      error: (err) => {
        this.loadingDropdown = false; 
      }
    });
  }


  private performSearchUser(term: string): void {
    this.loadingDropdown3 = true;
  let uri=this.baseUrl+"/base/user/list";
  let params: any={
    username: term,
    dropDown:"dropDown",
    pageNum: this.currentPage3.toString(),
    pageSize: this.pageSize3.toString()
  }
  this.commonService.getWithToken(uri, params).subscribe({
    next: (response) => {
        this.userOptions = response?.data?.listData || [];
        this.hasMore3 = this.userOptions.length === this.pageSize3;
        this.loadingDropdown3 = false;    
    },
    error: (err) => {
      this.loadingDropdown3 = false; 
    }
  });
  }

  loadMoreUser(): void {
    if (!this.hasMore3 || this.loadingDropdown3) return;

    
    if (!this.username || typeof this.username !== 'string') return;
    this.currentPage3++;
    this.loadingDropdown3 = true;
   let params: any={ 
    username: !this.username,  
    dropDown:"dropDown",
    pageNum: this.currentPage3.toString(),
    pageSize2: this.pageSize3.toString(),
    }

    let uri=this.baseUrl+"/base/user/list";
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
          this.userOptions = response?.data?.listData || [];
          this.hasMore3 = this.userOptions.length === this.pageSize3;
        this.loadingDropdown3 = false;
      },
      error: (err) => {
        this.loadingDropdown3 = false; 
      }
    });
  }

  onSearchUser(event: any): void {
    const term = event.term?.trim();
    if (this.debounceTimer3) {
      clearTimeout(this.debounceTimer3);
    }
    if (!term || term.length === 0) {
        this.userOptions = [];
      
           return;
    }
    this.debounceTimer3 = setTimeout(() => {
        this.currentPage3 = 1;
        this.hasMore3 = true;
        this.performSearchUser(term);
    }, 300);
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

