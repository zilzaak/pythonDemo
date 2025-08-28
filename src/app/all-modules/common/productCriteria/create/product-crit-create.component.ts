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
  entities:any[]=['Brand','ProductCat','ProductModel','ProductColor','ProductSize','MadeWith','UnitOfMeasure'];
  loadingDropdown = false;
  currentPage = 1; 
  pageSize = 10; 
  hasMore = true;   
  menuOptions:any[]=[];
  menuParents:any[]=[];
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
      this.opMode = 'create';
      this.api = this.baseUrl + '/setting/productCriteria/create';
    } else if (this.pageTitle === 'Edit') {
      this.opMode = 'edit';
      this.api = this.baseUrl + '/setting/productCriteria/update';
      this.formData(this.activeRouter.snapshot.params.id);
    } else if (this.pageTitle === 'View') {
      this.opMode = 'view';
      this.api = this.baseUrl + '/setting/productCriteria/list';
      this.formData(this.activeRouter.snapshot.params.id);
    }
  }


  formData(id: any) {
    const para = { moduleId :id , menuDetails:"menuDetails"};
    this.commmonService.getWithToken(this.baseUrl + '/base/module/list', para).subscribe({
      next: (response) => {

      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    });
  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      id: [null],
      entity: [''],
      name: ['',Validators.required],
      orgId: [''],
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


}
