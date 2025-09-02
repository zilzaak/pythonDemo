import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  constructor(private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router:Router
  ) { }
  createForm!: FormGroup;
  pageTitle!: any;
  baseUrl = environment.baseUrl;
  roleList: any[]=[];
  selectedRole:any[]=[];
  loading = false;
  editModeOrgData:any[]=[];


  loadingDropdown = false;
  currentPage = 1;
  pageSize = 10;  
  hasMore = true;  
  menuOptions:any[]=[];
  private debounceTimer: any;
  crudApi:any;
  crudMethod:any;

  ngOnInit(): void {
    this.initializeForm();
    this.fetchRoles();
    this.pageTitle = this.activeRouter.snapshot.data['title'];
    if(this.pageTitle==='Create'){
      this.crudApi = this.baseUrl + "/base/user/create";
      this.crudMethod="post";
    }
    if(this.pageTitle==='Edit'){
      this.crudApi = this.baseUrl + "/base/user/edit";
      this.crudMethod="put";
    }
    if(this.pageTitle==='View' || this.pageTitle==='Edit'){
    this.getFormData(this.activeRouter.snapshot.params.id);
    }
  }

  isExist(id:any){

    for(let x of this.selectedRole){
         if(x.id===id){
           return true;
         }
    }

    return false;
  }

  getFormData(id:any){
    let api=this.baseUrl+"/base/user/get"
    this.commmonService.getWithToken(api,{id:id}).subscribe(
      { next: (response) => {
          this.createForm.patchValue(response.data.user);
          this.selectedRole=response.data.user.roles;
          this.menuOptions=[];
          let orgIds:any[]=[];
          this.editModeOrgData=response.data.userOrg;
        for(let k of response.data.userOrg){
                let v:any={
                  id:k.orgId, orgName:k.orgName
                };
                this.menuOptions.push(v);
                orgIds.push(k.orgId);
            }
            this.createForm.controls['org'].setValue(orgIds);
        },
        error: (err) => {
        }
      }
    )

  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      id:[''],
      org:[''],
      enabled: [true],
      email: [''],
      username:[''],
      password:[''],
      phone: [''],
      address: ['', Validators.required],
      displayName: ['', Validators.required],
    });
  }

  fetchRoles() {
    let api=this.baseUrl+"/base/role/list"
    this.commmonService.getWithToken(api,{}).subscribe(
      { next: (response) => {
        this.roleList = response?.data?.listData;
        let index:any=-1;
        for(let m of this.roleList){
          index++;
          if(m.authority==='PERMIT_ALL'){
              break;
          }
        }
        this.roleList.splice(index,1);
        console.log("==========================")
        console.log(this.roleList)
        },
        error: (err) => {
        }
      }
    )
  }

  setRoles(index:any){
    console.log("======================");
    console.log(this.selectedRole);
    let role:any;
    role=this.roleList[index];
    let i:any;  i=0;
    for(let obj of this.selectedRole){
       if(role.id===obj.id){
        this.selectedRole.splice(i,1);
        return;
       }      
      i++;
      }
    this.selectedRole.push(role);
  }


  onSearch(event: any,menu:any): void {
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
        this.performSearch(term,menu);
    }, 300);
  }

  loadMore(menu:any): void {
    if (!this.hasMore || this.loadingDropdown) return;
    const term = this.createForm.get('menu')?.value?.trim();
    if (!term || typeof term !== 'string') return;
    this.currentPage++;
    this.loadingDropdown = true;
   let params: any={ menu: term, 
    dropDown:"gggggg", 
    pageNum: this.currentPage.toString(), 
    pageSize: this.pageSize.toString()
    }

    let uri=this.baseUrl+"/base/module/list";
    this.commmonService.getWithToken(uri, params).subscribe({
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


  private performSearch(term: string,menu:any): void {
      this.loadingDropdown = true;
    let uri=this.baseUrl+"/base/organization/list";
    let params: any={
      menu: term,
      dropDown:"gggggg",
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    }
    this.commmonService.getWithToken(uri, params).subscribe({
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


  onSubmit() {
    this.loading=true;
    const user = { ...this.createForm.value };
    user.roles = this.selectedRole.map(x => x.authority);  

    let orgIdList:any=this.createForm.value.org;
    let userOrgs:any[]=[];
    for(let x of orgIdList){
        let obj:any={
          id:null,
          org:x
        };
        for(let n of this.editModeOrgData){
           if(n.orgId===x){
            obj.id=n.id;
            break;
           }
        }
        userOrgs.push(obj);
    }
    user.userOrgs=userOrgs;

    this.commmonService.sendPostPutReq<any>(this.crudApi, user,this.crudMethod).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/base/user/list']);
        } else {
          alert(response.message);
        }
      }
    });
  }

}


