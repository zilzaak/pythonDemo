import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  loadingDropdown: boolean=false;
  menuOptions: any;
  hasMore: boolean=false;
  searchItem: any;
  private debounceTimer: any;
  currentPage = 1;
  pageSize = 10;
  listData:any[]=[];
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  totalItems = 0;
  totalPages = 0;
  pageTitle: any;
  entity: any;

  constructor(private commonService:CommonServiceService, 
        private activeRouter: ActivatedRoute, 
      private formBuilder: FormBuilder,) { }

 ngOnInit(): void {
  this.pageTitle = this.activeRouter.snapshot.data['title'];
  this.entity = this.activeRouter.snapshot.data['entity'];
 this.initForm();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      commonField:[''],
      orgId:['']
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
    pageSize: this.pageSize.toString(),
    entity:this.entity,
  };
  console.log("form value is ");
  console.log( this.searchForm.value);
  if(this.searchForm.value.commonField && this.searchForm.value.commonField!=null 
    && this.searchForm.value.commonField!==''
  ){
    params.commonField=this.searchForm.value.commonField;
  }

  if(this.entity==='Branch'){
    params.orgId=Number(localStorage.getItem('orgId'))
  }

    this.commonService.getWithToken(this.baseUrl+'/base/organization/list', params)
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

  setSearch(x: any) {
    this.searchItem = x.value;
  }

  onSearch(event: any): void {
    const term = event.term?.trim();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (!term || term.length === 0) {
      this.menuOptions = [];
      return;
    }
    this.debounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.hasMore = true;
      this.performSearch(term);
    }, 300);
  }

  loadMore(): void {
    if (!this.hasMore || this.loadingDropdown) return;

    const term = this.searchItem;
    if (!term || typeof term !== 'string') return;
    this.currentPage++;
    this.loadingDropdown = true;
    let params: any = {
      commonField: term,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    };

    let uri = this.baseUrl + '/base/organization/list';
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        this.menuOptions = response?.data?.listData || [];
        this.loadingDropdown = false;
      },
      error: (err) => {
        this.loadingDropdown = false;
      }
    });
  }

  private performSearch(term: string): void {
    this.loadingDropdown = true;
    let uri = this.baseUrl + '/base/organization/list';
    let params: any = {
      commonField: term,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      entity:'Organization'
    };
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        this.menuOptions = response?.data?.listData || [];
        this.hasMore = this.menuOptions.length === this.pageSize;
        this.loadingDropdown = false;
      },
      error: (err) => {
        this.loadingDropdown = false;
      }
    });
  }

}
