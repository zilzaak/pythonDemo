import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { LoginServiceService } from 'src/app/login-module/service/login-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {

  loadDropdownBranch: boolean = false;
  branchOptions: any;
  hasMoreBranch: boolean = false;

  listData:any[]=[];
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  private debounceTimer: any;
  roleList: any;
  username:any;
  menuOptions:any;
  loadingDropdownm = false;
  loadingDropdown = false;
  hasMore = true;
  searchItem:any;

  constructor(private commonService:CommonServiceService,  
      private formBuilder: FormBuilder,
    private loginService:LoginServiceService) { }

  async ngOnInit(): Promise<void> {
 let m:any=this.loginService.userInfo();
 let userData:any;
 userData = await this.loginService.userInfo();
 this.menuOptions=userData.orgList;
 this.initForm();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      commonField:[''],
      orgId:[Number(localStorage.getItem('orgId'))]
    })
  }

  setBranchId(x: any) {
    this.searchItem = x.value;
  }

  onSearchBranch(): void {
    const term = this.searchItem;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.hasMore = true;
      this.performSearchBranch(term);
    }, 300);
  }


  loadMoreBranch(): void {
    if (!this.hasMoreBranch || this.loadDropdownBranch) return;

    const term = this.searchItem;
    this.currentPage++;
    this.loadDropdownBranch = true;
    let params: any = {
      commonField: term,
      orgId: this.searchForm.value.orgId,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    };

    let uri = this.baseUrl + '/base/organization/list';
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        this.branchOptions = response?.data?.listData || [];
        this.loadDropdownBranch = false;
      },
      error: (err) => {
        this.loadDropdownBranch = false;
      }
    });
  }

  private performSearchBranch(term: string): void {
    this.loadDropdownBranch = true;
    let uri = this.baseUrl + '/base/organization/list';
    let params: any = {
      commonField: term,
      orgId: this.searchForm.value.orgId,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      entity: 'Branch'
    };

    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        this.branchOptions = response?.data?.listData || [];
        this.hasMoreBranch = this.branchOptions.length === this.pageSize;
        this.loadDropdownBranch = false;
      },
      error: (err) => {
        this.loadDropdownBranch = false;
      }
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

  setSearch(x: any) {

    this.searchItem = x.value;
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
  if(this.searchForm.value.orgId && this.searchForm.value.orgId!=null && this.searchForm.value.orgId!==''
  ){
    params.orgId=this.searchForm.value.orgId;
  }

  if(this.searchForm.value.commonField && this.searchForm.value.commonField!=null && this.searchForm.value.commonField!==''
  ){
    params.commonField=this.searchForm.value.commonField;
  }

    this.commonService.getWithToken('http://localhost:8000/purchase/supplier/list', params)
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

      deleteMenu(x:any){
        let formData:any={
          id:x
        };
          this.commonService.sendDeleteRequest(this.baseUrl+"/setting/product/delete",formData).subscribe({
          next: (response: any) => {
            if (response.success) {
              alert(response.message);
              this.ngOnInit();
            } else {
              alert(response.message);
            }
          },
          error: () => {
          }
        });

      }


}
