import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-org-create',
  templateUrl: './org-create.component.html',
  styleUrls: ['./org-create.component.css']
})
export class OrgCreateComponent implements OnInit {
  loadingDropdown: boolean=false;
  menuOptions: any;
  hasMore: boolean=false;
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


  ngOnInit(): void {
    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];
    this.entity = this.activeRouter.snapshot.data['entity'];
    if(this.pageTitle==='View' || this.pageTitle==='Edit'){
    this.getFormData(this.activeRouter.snapshot.params.id);
    }

    if(this.pageTitle==='Edit'){
      this.api="/base/organization/update";
      this.method="put";
      }

      if(this.pageTitle==='Create'){
        this.api="/base/organization/create";
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
      address: ['', Validators.required],
      remarks: ['', Validators.required],
      location:[''],
      orgId:['']
    });
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
    this.commmonService.getWithToken(uri, params).subscribe({
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
    let apiUrl:any=this.baseUrl+this.api;
  let org:any={
    id:this.createForm.value.id,    
    name:this.createForm.value.name,   
     phone:this.createForm.value.phone,
     address:this.createForm.value.address,
     remarks:this.createForm.value.remarks,
     entity:this.entity,
     location:this.createForm.value.location,
     orgId:this.createForm.value.orgId,
  } ;

    this.commmonService.sendPostPutReq<any>(apiUrl, org,this.method).subscribe({
      next: (response: any) => {
        if (response.success) {
          if(this.entity==='Organization'){
            this.router.navigate(['/base/organization/list']);
          }
          if(this.entity==='Branch'){
            this.router.navigate(['/base/branch/list']);
          }

        } else {
          alert(response.message);
        }
      }
    });
  }


}
