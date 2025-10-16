import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-supp-crud',
  templateUrl: './supp-crud.component.html',
  styleUrls: ['./supp-crud.component.css']
})
export class SuppCrudComponent implements OnInit {

  @ViewChild('myButton') myButton!: ElementRef;

   errorList:any;
   errorMessage:any;
  similarProduct: any;
  selectForm!: FormGroup;
  purchaseForm!: FormGroup;
  createForm!: FormGroup;
  pageTitle!: any;
  opMode!: any;
  api!: any;
  baseUrl = environment.baseUrl;
  loading = false;
  listData: any[] = [];
  loadDropOrg = false;
  loadDropSupp = false;
  loadDropPro = false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  hasMoreSupp = true;
  hasMorePro = true;
  menuOptions: any[] = [];
  products: any[] = [];
  suppList: any[] = [];
  private debounceTimer: any;
  searchItem: any;
  invList: any[] = [];
  madeWithOptions: any[] = [];
  branchList: any[] = [];
  id: any;
  stocks:any[]=[];
   priceSum:any=0;
   totalNetPrice:any=0;
   pricePayable:any=0; 
   totalDiscount:any=0;
   totalVat:any=0;
  constructor(
    private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stocks.push(50,50,450,120,22,45);
    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];

    if (this.pageTitle === 'Create') {
      this.menuOptions = [
        {
          id: Number(localStorage.getItem('orgId')),
          orgName: localStorage.getItem('orgName')
        }
      ];
      this.opMode = 'create';
      this.api = this.baseUrl + '/purchase/supplier/create';
    } else if (this.pageTitle === 'Edit') {
      this.opMode = 'edit';
      this.api = this.baseUrl + '/purchase/supplier/update';
      this.formData(this.activeRouter.snapshot.params.id);
    } else if (this.pageTitle === 'View') {
      this.opMode = 'view';
      this.api = this.baseUrl + '/purchase/supplier/list';
      this.formData(this.activeRouter.snapshot.params.id);
    }
  }


  ngAfterViewInit() {
    console.log('Button element:', this.myButton.nativeElement);
  }

  formData(id: any) {
    this.id = id;
    const para = { id: id };
    this.commmonService.getWithToken(this.baseUrl + '/purchase/supplier/list', para).subscribe({
      next: (response) => {
        this.menuOptions = [
          {id: Number(localStorage.getItem('orgId')),
          orgName: localStorage.getItem('orgName')
          }
        ];
        let resp: any = response.data.listData[0];
        this.allPurchs.insert(0, this.sellPriceCreate(resp));
        this.allPurchs.removeAt(1);
        if (this.opMode === 'view') {
          this.createForm.disable();
          this.purchaseForm.disable();
        }
      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    });
  }

  initializeForm() {
    this.purchaseForm = this.formBuilder.group(
      {
        purchPrices: this.formBuilder.array([this.sellPriceCreate(null)])
      }
    );
  }

  sellPriceCreate(obj:any): FormGroup {
    if(obj==null){
      return this.formBuilder.group({
        id:[''],
        orgId:['',Validators.required],
        name:['',Validators.required],
        phone:[''],
        address:['',Validators.required],
     })
    }else{
      return this.formBuilder.group({
        id:[obj.id],
        orgId:[obj.orgId],
        name:[obj.name],
        phone:[obj.phone],
        address:[obj.address],
     })
    }

  }
  get allPurchs(): FormArray {
    return this.purchaseForm.get("purchPrices") as FormArray;
  }

  addSell(index: number): void {
    this.allPurchs.insert(index, this.sellPriceCreate(null));
  }

  removeSell(index: any): void {
    this.allPurchs.removeAt(index);
  }


  onSubmit() {
    if (this.opMode === 'view') return;

    this.loading = true;
    let payload: any = { ...this.purchaseForm.value };
    let objList:any=payload.purchPrices;

    if (this.purchaseForm.invalid || objList.length<1) {
      this.loading = false;
      alert('Invalid form');
      return;
    }

    let method = this.opMode === 'create' ? 'post' : 'put';
    this.commmonService.sendPostPutReq<any>(this.api.toString(), objList, method).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/purchase/supplier/list']);
        } else {
          this.errorMessage=response.message;
          this.errorList=response.data;
          this.loading = false;
          this.myButton.nativeElement.click();
        }
      },
      error: () => {
        this.loading = false;
      }
    });

  }

  setSearch(x: any) {
    this.searchItem = x.value;
  }


  onSearch(entity: any): void {
    const term = this.searchItem;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.currentPage = 1;
      if (entity === 'Organization') {
        this.hasMore = true;
      }
      if (entity === 'Supplier') {
        this.hasMoreSupp = true;
      }
      if (entity === 'Product') {
        this.hasMorePro = true;
      }

      this.performSearch(term, entity);
    }, 300);
  }

  loadMore(entity: any): void {
    const term = this.searchItem;
    this.currentPage++;
    let uri: string = '';

    let params: any = {
      commonField: term, 
      dropDown: 'dropDown',entity: entity,
      name:term,
      orgId:this.createForm.value.orgId,
      pageNum: this.currentPage.toString(),pageSize: this.pageSize.toString()
    };

    if (entity === 'Organization') {
      this.loadDropOrg = true;
      uri = this.baseUrl + '/base/organization/list';
    }
    if (entity === 'Supplier') {
      this.loadDropSupp = true;
      uri = this.baseUrl + '/purchase/supplier/list';
    }
    if (entity === 'Product') {
      this.loadDropPro = true;
      uri = this.baseUrl + '/setting/product/list';
    }

    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if (entity === 'Organization') {
          this.menuOptions = response?.data?.listData || [];
          this.loadDropOrg = false;
        }
        if (entity === 'Supplier') {
          this.suppList = response?.data?.listData || [];
          this.loadDropSupp = false;
        }
        if (entity === 'Product') {
          this.products = response?.data?.listData || [];
          this.loadDropPro = false;
        }

      },
      error: (err) => {
        this.loadDropOrg = false;
        this.loadDropSupp = false;
        this.loadDropPro = false;
      }
    });
  }

  private performSearch(term: string, entity: any): void {
    let uri: string = '';
    if (entity === 'Organization') {
      this.loadDropOrg = true;
      uri = this.baseUrl + '/base/organization/list';
    }
    if (entity === 'Supplier') {
      this.loadDropSupp = true;
      uri = this.baseUrl + '/purchase/supplier/list';
    }
    if (entity === 'Product') {
      this.loadDropPro = true;
      uri = this.baseUrl + '/setting/product/list';
    }

    let params: any = {
      commonField: term,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      entity: entity,
      name:term,
      orgId:this.createForm.value.orgId
    };

    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if (entity === 'Organization') {
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
          this.loadDropOrg = false;
        }
        if (entity === 'Supplier') {
          this.suppList = response?.data?.listData || [];
          this.hasMoreSupp = this.menuOptions.length === this.pageSize;
          this.loadDropSupp = false;
        }
        if (entity === 'Product') {
          this.products = response?.data?.listData || [];
          this.hasMorePro = this.products.length === this.pageSize;
          this.loadDropPro = false;
        }
      },
      error: (err) => {
        this.loadDropOrg = false;
        this.loadDropSupp = false;
        this.loadDropPro = false;
      }
    });
  }



}
