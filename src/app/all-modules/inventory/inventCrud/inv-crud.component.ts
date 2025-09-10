import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from '../../commonService/common-service.service';

@Component({
  selector: 'app-inv-crud',
  templateUrl: './inv-crud.component.html',
  styleUrls: ['./inv-crud.component.css']
})
export class InvCrudComponent implements OnInit {

  loadDropdown: boolean=false;
  loadDropdownBranch: boolean=false;
  menuOptions: any;
  branchOptions:any;
  hasMore: boolean=false;
  hasMoreBranch: boolean=false;
  searchItem: any;
  private debounceTimer: any;
  currentPage = 1;
  method:any;
  api:any;
  pageSize = 10;
  constructor(private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router:Router
  ) { }
  createForm!: FormGroup;
  pageTitle!: any;
  entity!:any;
  baseUrl = environment.baseUrl;
  loading = false;
   id:any;

  ngOnInit(): void {
    this.menuOptions=[
      {
        id:Number(localStorage.getItem('orgId')),
        orgName:localStorage.getItem('orgName')
      }
    ];

    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];
    this.entity = this.activeRouter.snapshot.data['entity'];
    if(this.pageTitle==='View' || this.pageTitle==='Edit'){
      this.id=this.activeRouter.snapshot.params.id;
    this.getFormData(this.activeRouter.snapshot.params.id);
    }

    if(this.pageTitle==='Edit'){
      this.api="/inventory/update";
      this.method="put";
      }

      if(this.pageTitle==='Create'){
        this.api="/inventory/create";
        this.method="post";
        }
  }


  getFormData(id:any){
    let api=this.baseUrl+"/base/organization/list"
    let params:any={ };
    if(this.entity==='Organization'){
        params.id=id,
        params.entity=this.entity
    };
    if(this.entity==='Branch'){
      params.id=id,
      params.orgId=Number(localStorage.getItem('orgId')),
      params.entity=this.entity
  };
  
    this.commmonService.getWithToken(api,params).subscribe(
      { next: (response) => {
        this.createForm.patchValue(response?.data?.listData[0]);
        if(this.entity==='Branch'){
        this.menuOptions=[{orgName:response?.data?.listData[0].orgName ,
           id:response?.data?.listData[0].orgId}];
        }
        if(this.pageTitle==='View'){
          this.createForm.disable();
        }
        },
        error: (err) => {
        }
      }
    )
  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      id:[''],
      name:['',Validators.required],
      phone: [''],
      others:[''],
      orgId:[Number(localStorage.getItem('orgId'))],
      branchId:['', Validators.required]
    });
  }


  setSearch(x: any) {
    this.searchItem = x.value;
  }

  setBranchId(x: any) {
    this.searchItem = x.value;
  }

  onSearch(): void {
    const term = this.searchItem;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.hasMore = true;
      this.performSearch(term);
    }, 300);
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

  loadMore(): void {
    if (!this.hasMore || this.loadDropdown) return;

    const term = this.searchItem;
    this.currentPage++;
    this.loadDropdown = true;
    let params: any = {
      commonField: term,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    };

    let uri = this.baseUrl + '/base/organization/list';
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        this.menuOptions = response?.data?.listData || [];
        this.loadDropdown = false;
      },
      error: (err) => {
        this.loadDropdown = false;
      }
    });
  }

  loadMoreBranch(): void {
    if (!this.hasMoreBranch || this.loadDropdownBranch) return;

    const term = this.searchItem;
    this.currentPage++;
    this.loadDropdownBranch = true;
    let params: any = {
      commonField: term,
      orgId:this.createForm.value.orgId,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    };

    let uri = this.baseUrl + '/base/organization/list';
    this.commmonService.getWithToken(uri, params).subscribe({
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
      orgId:this.createForm.value.orgId,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      entity:'Branch'
    };

    this.commmonService.getWithToken(uri, params).subscribe({
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

  private performSearch(term: string): void {
    this.loadDropdown = true;
    let uri = this.baseUrl + '/base/organization/list';
    let params: any = {
      commonField: term,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      entity:'Organization'
    };
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        this.menuOptions = response?.data?.listData || [];
        this.hasMore = this.menuOptions.length === this.pageSize;
        this.loadDropdown = false;
      },
      error: (err) => {
        this.loadDropdown = false;
      }
    });
  }
  
  onSubmit() {
    this.loading=true;
    let apiUrl:any=this.baseUrl+this.api;
    let org:any={
     id:this.createForm.value.id,    
     name:this.createForm.value.name,   
     phone:this.createForm.value.phone,
     others:this.createForm.value.others,
     branchId:this.createForm.value.branchId
     };

    this.commmonService.sendPostPutReq<any>(apiUrl, org,this.method).subscribe({
      next: (response: any) => {
        if (response.success) {
            this.router.navigate(['/inventory/list']);     
        } else {
          alert(response.message);
        }
      }
    });
  }

}
