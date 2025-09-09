import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-crit-create',
  templateUrl: './product-crit-create.component.html',
  styleUrls: ['./product-crit-create.component.css']
})
export class ProductCritCreateComponent implements OnInit {

  createForm!: FormGroup;
  pageTitle!: any;
  opMode!: any;
  api!: any;
  baseUrl = environment.baseUrl;
  loading = false;
  listData:any[]=[];
  entities:any[]=[{id:'Brand',title:'Brand'},
    {id:'ProductCat',title:'Category'},
    {id:'ProductModel',title:'Model'},
    {id:'ProductColor',title:'Color'},
    {id:'ProductSize',title:'Size/Dimension/Volume'},
    {id:'MadeWith',title:'Made With'}];
  loadingDropdown = false;
  barndLoadingDropDown=false;
  currentPage = 1; 
  pageSize = 10; 
  hasMore = true;   
  brandHasMore = true; 
  menuOptions:any[]=[];
  brandOptions:any[]=[];
  private debounceTimer: any;
  searchItem:any;

  constructor(
    private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];

    if (this.pageTitle === 'Create') {
      this.menuOptions=[
        {
          id:Number(localStorage.getItem('orgId')),
          orgName:localStorage.getItem('orgName')
        }
      ]
      this.opMode = 'create';
      this.api = this.baseUrl + '/setting/productCriteria/create';
    } else if (this.pageTitle === 'Edit') {
      this.opMode = 'edit';
      this.api = this.baseUrl + '/setting/productCriteria/update';
      this.formData(this.activeRouter.snapshot.params.id,this.activeRouter.snapshot.params.entity);
    } else if (this.pageTitle === 'View') {
      this.opMode = 'view';
      this.api = this.baseUrl + '/setting/productCriteria/list';
      this.formData(this.activeRouter.snapshot.params.id,this.activeRouter.snapshot.params.entity);
    }
  }


  formData(id: any,entity:any) {
    let org:any=localStorage.getItem('orgId');
    const para = { id :id , entity:entity,orgId:org};
    this.commmonService.getWithToken(this.baseUrl + '/setting/productCriteria/list', para).subscribe({
      next: (response) => {
        this.menuOptions=[
          { id:localStorage.getItem('orgId'),orgName:localStorage.getItem('orgName')
          }
        ];
         this.createForm.patchValue(response.data.listData[0]);
         this.createForm.controls['entity'].setValue(entity);
         this.createForm.controls['orgId'].setValue(localStorage.getItem('orgId'));
         this.brandOptions=[
          {
            id:response.data.listData[0]?.brandId,
            name:response.data.listData[0]?.brandName,
          }
         ]
         
         if(this.opMode==='view'){
          this.createForm.disable();
         }

      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    });
  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      id: [null],
      entity: ['',Validators.required],
      name: ['',Validators.required],
      orgId: [Number(localStorage.getItem('orgId'))],
      brandId:[''],
      description:['',Validators.required]
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
    this.commmonService.sendPostPutReq<any>(this.api.toString(), payload,method).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/common/productCrit/list']);
        } else {
          this.loading = false;
          alert(response.message);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setSearch(x:any){
    this.searchItem=x.value;
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
   let params: any={ 
    commonField: term, 
    dropDown:"dropDown", 
    pageNum: this.currentPage.toString(), 
    pageSize: this.pageSize.toString()
    }

    let uri=this.baseUrl+"/base/organization/list";
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
    let uri=this.baseUrl+"/base/organization/list";
    let params: any={
      commonField: term,
      dropDown:"dropDown",
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

  onBrandSearch(event: any): void {
    const term = event.term?.trim();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (!term || term.length === 0) {
        this.brandOptions = [];

     return;
    }
    this.debounceTimer = setTimeout(() => {
       this.currentPage = 1;
        this.brandHasMore = true;
      this.brandPerformSearch(term);
    }, 300);
  }

  brandLoadMore(): void {
    if (!this.brandHasMore || this.barndLoadingDropDown) return;

    const term = this.searchItem;
    if (!term || typeof term !== 'string') return;
    this.currentPage++;
    this.barndLoadingDropDown = true;
   let params: any={ 
    name: term, 
    entity:"Brand", 
    pageNum: this.currentPage.toString(), 
    pageSize: this.pageSize.toString()
    }

    let uri=this.baseUrl+"/setting/productCriteria/list";
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
          this.brandOptions = response?.data?.listData || [];
        this.barndLoadingDropDown = false;
      },
      error: (err) => {
        this.barndLoadingDropDown = false; 
      }
    });
  }

  private brandPerformSearch(term: string): void {
    this.barndLoadingDropDown = true;
  let uri=this.baseUrl+"/setting/productCriteria/list";
  let params: any={
    entity: 'Brand',
    pageNum: this.currentPage.toString(),
    pageSize: this.pageSize.toString(),
    name:this.searchItem,
    orgId:this.createForm.value.orgId
  }
  this.commmonService.getWithToken(uri, params).subscribe({
    next: (response) => {
         this.brandOptions = response?.data?.listData || [];
        this.brandHasMore = this.brandOptions.length === this.pageSize;
        this.barndLoadingDropDown = false; 
      
    },
    error: (err) => {
      this.barndLoadingDropDown = false; 
    }
  });
}


}
