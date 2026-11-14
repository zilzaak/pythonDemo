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
  parentMenuOptions:any[]=[];
  userOptions:any[]=[];
  private debounceTimer: any;
  private debounceTimerp: any;
  roleList: any;
  searchForm!: FormGroup;

  private debounceTimer3: any;
  loading3 = false;
  loadingP = false;
  loadingDropdown3 = false;
  loadingDropdownp = false;
  currentPage3 = 1;
  pageSize3 = 10;    
  hasMore3 = true; 
  hasMorep = true; 
  username: any;

  pvalue:any;
  uvalue:any;

  currentPagep = 1;
  pageSizeP = 10;   

  selectedParentOption: any = null;
  selectedMenuOption: any = null;
  selectedRoleOption: any = null;
  selectedUserOption: any = null;

  constructor(private commonService:CommonServiceService,   
     private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchRoles();
    this.restoreSearchState();
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      userId:[''],
      roleId:[''],
      menuId:[''],
      parentMenuId:['']
    });
  }

  saveSearchState(): void {
    const parentId = this.searchForm.value.parentMenuId;
    const menuId = this.searchForm.value.menuId;
    const roleId = this.searchForm.value.roleId;
    const userId = this.searchForm.value.userId;

    const parentOpt = parentId ? (this.parentMenuOptions?.find((m: any) => m.id === parentId) || this.selectedParentOption) : null;
    const menuOpt = menuId ? (this.menuOptions?.find((u: any) => u.id === menuId) || this.selectedMenuOption) : null;
    const roleOpt = roleId ? (this.roleList?.find((r: any) => r.id === roleId) || this.selectedRoleOption) : null;
    const userOpt = userId ? (this.userOptions?.find((u: any) => u.id === userId) || this.selectedUserOption) : null;

    const state = {
      parentMenuId: parentId || '',
      menuId: menuId || '',
      roleId: roleId || '',
      userId: userId || '',
      currentPage: this.currentPage,
      selectedParentOption: parentOpt || null,
      selectedMenuOption: menuOpt || null,
      selectedRoleOption: roleOpt || null,
      selectedUserOption: userOpt || null
    };

    sessionStorage.setItem('menu_perm_search_state', JSON.stringify(state));
  }

  restoreSearchState(): void {
    const savedStateStr = sessionStorage.getItem('menu_perm_search_state');
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        if (savedState) {
          if (savedState.selectedParentOption) {
            this.selectedParentOption = savedState.selectedParentOption;
            this.parentMenuOptions = [savedState.selectedParentOption];
          }
          if (savedState.selectedMenuOption) {
            this.selectedMenuOption = savedState.selectedMenuOption;
            this.menuOptions = [savedState.selectedMenuOption];
          }
          if (savedState.selectedUserOption) {
            this.selectedUserOption = savedState.selectedUserOption;
            this.userOptions = [savedState.selectedUserOption];
          }
          if (savedState.selectedRoleOption) {
            this.selectedRoleOption = savedState.selectedRoleOption;
            if (!this.roleList || this.roleList.length === 0) {
              this.roleList = [savedState.selectedRoleOption];
            }
          }

          this.searchForm.patchValue({
            parentMenuId: savedState.parentMenuId || '',
            menuId: savedState.menuId || '',
            roleId: savedState.roleId || '',
            userId: savedState.userId || ''
          });

          const pageToLoad = savedState.currentPage ? Number(savedState.currentPage) : 1;
          this.loadPage(pageToLoad);
          return;
        }
      } catch (e) {
        console.error('Error restoring menu permission search state', e);
      }
    }
    this.loadPage(1);
  }

  onParentMenuChange(selected: any): void {
    this.selectedParentOption = selected || null;
    this.currentPage = 1;
    this.getList();
  }

  onMenuChange(selected: any): void {
    this.selectedMenuOption = selected || null;
    this.currentPage = 1;
    this.getList();
  }

  onRoleChange(selected: any): void {
    this.selectedRoleOption = selected || null;
    this.currentPage = 1;
    this.getList();
  }

  onUserChange(selected: any): void {
    this.selectedUserOption = selected || null;
    this.currentPage = 1;
    this.getList();
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

  setuValue(x:any){
this.uvalue=x.value
  }

  setpValue(x:any){
    this.pvalue=x.value
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

  if(this.searchForm.value.roleId && this.searchForm.value.roleId!=null
     && this.searchForm.value.roleId!==''){
    params.roleId=this.searchForm.value.roleId;
  }
  if(this.searchForm.value.userId && this.searchForm.value.userId!=null
     && this.searchForm.value.userId!==''){
    params.userId=this.searchForm.value.userId;
  }
  if(this.searchForm.value.menuId && this.searchForm.value.menuId!=null 
    && this.searchForm.value.menuId!==''){
    params.menuId=this.searchForm.value.menuId;
  }
  if(this.searchForm.value.parentMenuId && this.searchForm.value.parentMenuId!=null 
    && this.searchForm.value.parentMenuId!==''){
    params.parentMenuId=this.searchForm.value.parentMenuId;
  }

  this.saveSearchState();

  console.log("search form vaue is ");
  console.log(this.searchForm.value);
  console.log("params vaue is ");
  console.log(params);

    this.commonService.getWithToken(this.baseUrl+'/base/permittedModule/list', params)
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
    sessionStorage.removeItem('menu_perm_search_state');
    this.selectedParentOption = null;
    this.selectedMenuOption = null;
    this.selectedRoleOption = null;
    this.selectedUserOption = null;
    this.parentMenuOptions = [];
    this.menuOptions = [];
    this.userOptions = [];
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

  onSearchp(): void {
    const term =this.pvalue;
    if (this.debounceTimerp) {
      clearTimeout(this.debounceTimerp);
    }
    if (!term || term.length === 0) {
            this.parentMenuOptions = [];
                return;
    }
    this.debounceTimerp = setTimeout(() => {
        this.currentPagep = 1;
        this.hasMorep = true;     
      this.performSearchp(term);
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

    let uri=this.baseUrl+"/base/menu/list";
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


  loadMorep(): void {
    if (!this.hasMorep || this.loadingDropdownp) return;

    const term = this.pvalue;
    if (!term || typeof term !== 'string') return;
    this.currentPagep++;
    this.loadingDropdownp = true;
   let params: any={ menu: term,  
     pageNum: this.currentPagep.toString(),
     pageSize: this.pageSizeP.toString(),
     menuSearch:"menuSearch"
    }

    let uri=this.baseUrl+"/base/menu/list";
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
          this.parentMenuOptions = response?.data?.listData || [];
          this.hasMorep = this.parentMenuOptions.length === this.pageSizeP;    
          this.loadingDropdownp = false;
      },
      error: (err) => {
        this.loadingDropdownp = false; 
      }
    });
  }

  private performSearch(term: string,menu:any): void {
        if(menu==='menu'){
      this.loadingDropdown = true;
    }

    let uri=this.baseUrl+"/base/menu/list";
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


  private performSearchp(term: string): void {
  this.loadingDropdownp = true;
let uri=this.baseUrl+"/base/menu/list";
let params: any={
  menu: term,
  menuSearch:"menuSearch",
  pageNum: this.currentPagep.toString(),
  pageSize: this.pageSizeP.toString()
}
this.commonService.getWithToken(uri, params).subscribe({
  next: (response) => {
      this.parentMenuOptions = response?.data?.listData || [];
      this.hasMorep = this.parentMenuOptions.length === this.pageSizeP;
      this.loadingDropdownp = false; 
  },
  error: (err) => {
    this.loadingDropdownp = false; 
  }
});
}

deleteData(x:any){
  if (!confirm('Are you sure you want to delete this menu permission?')) {
    return;
  }
  let formData:any={
    id:x
  };
  
  this.commonService.sendDeleteRequest(this.baseUrl+"/base/permittedModule/delete",formData).subscribe({
    next: (response: any) => {
      if (response.success) {
        alert(response.message);
        this.ngOnInit();
      } else {
        alert(response.message);
      }
    },
    error: () => {
      this.loading = false;
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

