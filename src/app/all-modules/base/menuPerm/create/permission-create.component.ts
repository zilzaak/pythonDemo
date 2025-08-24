import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-permission-create',
  templateUrl: './permission-create.component.html',
  styleUrls: ['./permission-create.component.css']
})
export class PermissionCreateComponent implements OnInit {

  createForm!: FormGroup;
  pageTitle!: any;
  opMode!: any;
  api!: any;
  baseUrl = environment.baseUrl;
  loading = false;
  listData:any[]=[];
  loadingDropdown = false;
  currentPage = 1;
  pageSize = 10;    
  hasMore = true; 
  menuOptions:any[]=[];
  userOptions:any[]=[];
  private debounceTimer: any;

  loading2 = false;
  loadingDropdown2 = false;
  currentPage2 = 1;
  pageSize2 = 10;    
  hasMore2 = true; 
  username:any;
  private debounceTimer2: any;

  roleList:any[]=[];
  constructor(
    private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];
    this.fetchRoles();
    if (this.pageTitle === 'Create') {
      this.opMode = 'create';
      this.api = this.baseUrl + '/base/permittedModule/create';
    } else if (this.pageTitle === 'Edit') {
      this.opMode = 'edit';
      this.api = this.baseUrl + '/base/permittedModule/update';
      this.formData(this.activeRouter.snapshot.params.id);
    } else if (this.pageTitle === 'View') {
      this.opMode = 'view';
      this.api = this.baseUrl + '/base/permittedModule/list';
      this.formData(this.activeRouter.snapshot.params.id);
    }
  }


  formData(id: any) {
    const para = { id :id};
    this.commmonService.getWithToken(this.baseUrl + '/base/permittedModule/list', para).subscribe({
      next: (response) => {
        this.menuOptions=[
          {
            id:response?.data?.listData[0]?.menuId,
            urlCode:response?.data?.listData[0]?.backendUrl
          }
        ];
        this.createForm.controls['id'].setValue(response?.data?.listData[0]?.id);
        this.createForm.controls['menuId'].setValue(response?.data?.listData[0]?.menuId);
        this.createForm.controls['backendUrl'].setValue(response?.data?.listData[0]?.backendUrl);
        this.createForm.controls['user'].setValue(response?.data?.listData[0]?.userId);
        this.createForm.controls['role'].setValue(response?.data?.listData[0]?.roleId);
        this.createForm.controls['method'].setValue(response?.data?.listData[0]?.methodName);
        this.menuOptions=[
          {
            id:response?.data?.listData[0].menuId,
           urlCode:response?.data?.listData[0].backendUrl
          }
        ];
        this.userOptions=[
          {
            id:response?.data?.listData[0]?.userId,
            username:response?.data.listData[0].username
          }
        ];
        console.log("======================================================");
        console.log(this.createForm.value);
        if(this.opMode==='view'){
          this.createForm.controls['menuId'].disable();
          this.createForm.controls['backendUrl'].disable();
          this.createForm.controls['user'].disable();
          this.createForm.controls['role'].disable();
        }
      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    });
  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      id:[''],
      backendUrl:[''],
      user:[''],
      role:[''],
      method:[''],
      menuId:[''],
      username:['']
    });
  }

  onSubmit() {
    if (this.opMode === 'view') return;
    if(this.createForm.invalid){
      alert("Invalid form");
      return;
    }
    this.loading = true;
    let payload:any={ ...this.createForm.value};
    let method = this.opMode === 'create' ? 'post' : 'put';
    let formData:any[]=[];
    formData.push(payload);
    this.commmonService.sendPostPutReq<any>(this.api.toString(), formData,method).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/base/menuPerm/list']);
        } else {
          alert(response.message);
          this.router.navigate(['/base/menuPerm/list']);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }


  fetchRoles() {
    let api=this.baseUrl+"/base/role/list"
    this.commmonService.getWithToken(api,{}).subscribe(
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
        this.currentPage = 1;
        this.hasMore = true;
      }
      this.performSearch(term,menu);
    }, 300);
  }

  onSearchUser(event: any): void {
    const term = event.term?.trim();
    if (this.debounceTimer2) {
      clearTimeout(this.debounceTimer2);
    }
    if (!term || term.length === 0) {
        this.userOptions = [];
      
           return;
    }
    this.debounceTimer2 = setTimeout(() => {
        this.currentPage2 = 1;
        this.hasMore2 = true;
        this.performSearchUser(term);
    }, 300);
  }

  loadMore(menu:any): void {
    if (!this.hasMore || this.loadingDropdown) return;

    const term = this.createForm.get('menu')?.value?.trim();
    if (!term || typeof term !== 'string') return;
    this.currentPage++;
    this.loadingDropdown = true;
   let params: any={ menu: term,  
    pageNum: this.currentPage.toString(),
     pageSize: this.pageSize.toString(),
     loadMethod:"loadMethod"
    }

    let uri=this.baseUrl+"/base/module/list";
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(menu==='menu'){
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
        }
        this.loadingDropdown = false;
      },
      error: (err) => {
        this.loadingDropdown = false; 
      }
    });
  }

  loadMoreUser(): void {
    if (!this.hasMore2 || this.loadingDropdown2) return;

    
    if (!this.username || typeof this.username !== 'string') return;
    this.currentPage2++;
    this.loadingDropdown2 = true;
   let params: any={ 
    username: !this.username,  
    dropDown:"dropDown",
    pageNum: this.currentPage2.toString(),
    pageSize2: this.pageSize2.toString(),
    }

    let uri=this.baseUrl+"/base/user/list";
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
          this.userOptions = response?.data?.listData || [];
          this.hasMore2 = this.userOptions.length === this.pageSize2;
        this.loadingDropdown2 = false;
      },
      error: (err) => {
        this.loadingDropdown2 = false; 
      }
    });
  }

  setUser(){
for(let k of this.userOptions){
if(k.userId===this.createForm.value.user){
this.username=k.username;
 break;
}
}

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
    this.commmonService.getWithToken(uri, params).subscribe({
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
  this.loadingDropdown2 = true;
let uri=this.baseUrl+"/base/user/list";
let params: any={
  username: term,
  dropDown:"dropDown",
  pageNum: this.currentPage2.toString(),
  pageSize: this.pageSize2.toString()
}
this.commmonService.getWithToken(uri, params).subscribe({
  next: (response) => {
      this.userOptions = response?.data?.listData || [];
      this.hasMore2 = this.userOptions.length === this.pageSize2;
      this.loadingDropdown2 = false;    
  },
  error: (err) => {
    this.loadingDropdown2 = false; 
  }
});
}


  setMethod(){
    for(let c of this.menuOptions){
         if(c.id===this.createForm.value.menuId){
          this.createForm.controls['method'].setValue(c.methodName);
          this.createForm.controls['backendUrl'].setValue(c.apiPattern);
          break;
         }
    }
  }


}
