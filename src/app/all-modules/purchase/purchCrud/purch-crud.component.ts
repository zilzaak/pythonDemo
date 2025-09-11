import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from '../../commonService/common-service.service';

@Component({
  selector: 'app-purch-crud',
  templateUrl: './purch-crud.component.html',
  styleUrls: ['./purch-crud.component.css']
})
export class PurchCrudComponent implements OnInit {
    @ViewChild('myButton') myButton!: ElementRef;
    
  similarProduct:any;
  sellForm!: FormGroup;
  createForm!: FormGroup;
  pageTitle!: any;
  opMode!: any;
  api!: any;
  baseUrl = environment.baseUrl;
  loading = false;
  listData: any[] = [];
  loadDropOrg = false;
  loadDropSupp=false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  hasMoreSupp = true;
  menuOptions: any[] = [];
  suppList:any[]=[];
  private debounceTimer: any;
  searchItem: any;
  invList:any[]=[];
  madeWithOptions: any[] = [];
  branchList:any[]=[];

  id:any;

  constructor(
    private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAllBranch();
    this.pageTitle = this.activeRouter.snapshot.data['title'];

    if (this.pageTitle === 'Create') {
      this.menuOptions = [
        {
          id: Number(localStorage.getItem('orgId')),
          orgName: localStorage.getItem('orgName')
        }
      ];
      this.opMode = 'create';
      this.api = this.baseUrl + '/setting/product/create2';
    } else if (this.pageTitle === 'Edit') {
      this.opMode = 'edit';
      this.api = this.baseUrl + '/setting/product/update';
      this.formData(this.activeRouter.snapshot.params.id);
    } else if (this.pageTitle === 'View') {
      this.opMode = 'view';
      this.api = this.baseUrl + '/setting/product/list';
      this.formData(this.activeRouter.snapshot.params.id);
    }
  }

  loadAllBranch(){
    let org: any = this.createForm.value.orgId;
    const para = { entity:'Branch',orgId: org ,pageNum:1,pageSize:50};
    this.commmonService.getWithToken(this.baseUrl + '/base/organization/list', para).subscribe({
      next: (response) => {
        this.branchList=response.data.listData;
      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    }); 
  }

  loadInventory(){
    let org: any = this.createForm.value.orgId;
    let branch:any=this.createForm.value.branchId;
    const para = {orgId: org ,branchId:branch , dropDown:"need" , pageNum:1,pageSize:50};
    this.commmonService.getWithToken(this.baseUrl + '/inventory/list', para).subscribe({
      next: (response) => {
        this.invList=response.data.listData;
      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    }); 
  }

  ngAfterViewInit() {
    console.log('Button element:', this.myButton.nativeElement);
  }

  formData(id: any) {
    this.id=id;
    let org: any = localStorage.getItem('orgId');
    const para = { id: id, orgId: org };
    this.commmonService.getWithToken(this.baseUrl + '/purchase/product/list', para).subscribe({
      next: (response) => {
        this.menuOptions = [
          {
            id: Number(localStorage.getItem('orgId')),
            orgName: localStorage.getItem('orgName')
          }
        ];
        let resp: any = response.data.listData[0];
        this.createForm.patchValue(resp);
        if (this.opMode === 'view') {
          this.createForm.disable();
          this.sellForm.disable();
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
      name: ['', [Validators.required, Validators.maxLength(100)]],
      orgId: [Number(localStorage.getItem('orgId')),[Validators.required, Validators.maxLength(100)]],
      branchId: [null],
      inventoryId:[''],
      supplierId:[''],
      description: ['', [Validators.maxLength(500)]],
      confirmSimilarity:[false]
    });
    this.sellForm= this.formBuilder.group(
      {
        sellPrices:this.formBuilder.array([this.sellPriceCreate()])
      }
    );
  }

  sellPriceCreate():FormGroup{
      return this.formBuilder.group({
        branchId:[''],
        price:[''],
      })
  }
  get allSells():FormArray{
    return this.sellForm.get("sellPrices") as FormArray;
  }

  addSell():void{
 this.allSells.push(this.sellPriceCreate());
  }

  removeSell(index:any):void{
    if(Number(index)<1){
      return;
    }
   this.allSells.removeAt(index);
  }


  confirmSimilarity(){
    this.createForm.controls['confirmSimilarity'].setValue(true);
    this.onSubmit();
  }

  onSubmit() {
    if (this.opMode === 'view') return;
    if (this.createForm.invalid) {
      alert('Invalid form');
      return;
    }
    this.loading = true;
    let payload: any = { ...this.createForm.value };

    let spi:any={
      sellPrices:null,
      sellBranchIds:null,
      costPrices:null,
      costBranchIds:null,
    };

    for (let hb of this.sellForm.value.sellPrices) {
    if(spi.sellBranchIds==null){
        spi.sellBranchIds=hb.branchId.toString();
        spi.sellPrices=hb.price.toString();
      }else{
        spi.sellBranchIds=spi.sellBranchIds.toString()+","+hb.branchId.toString();
        spi.sellPrices=spi.sellPrices.toString()+","+hb.price.toString();
      }
    }

    let method = this.opMode === 'create' ? 'post' : 'put';
    this.commmonService.sendPostPutReq<any>(this.api.toString(), payload, method).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/common/product/list']);
        } else {
          this.loading = false;
          if (response.message.includes('Similar')) {
            this.similarProduct=response.data.existsData;
            this.myButton.nativeElement.click();
          }else{
            alert(response.message);
          }
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

  onSearch(entity:any): void {
    const term = this.searchItem;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }


    this.debounceTimer = setTimeout(() => {
      this.currentPage = 1;
      if(entity==='Organization'){
        this.hasMore = true;
      }
      if(entity==='Supplier'){
        this.hasMoreSupp = true;
      }

      this.performSearch(term,entity);
    }, 300);
  }

  loadMore(entity:any): void {
    const term = this.searchItem;
    this.currentPage++;
    let uri:string='';
    if(entity==='Organization'){
      this.loadDropOrg = true;
      uri = this.baseUrl + '/base/organization/list';
    }
    if(entity==='Supplier'){
      this.loadDropSupp = true;
      uri = this.baseUrl + '/purchase/supplier/list';
    }

    let params: any = {
      commonField: term,
      dropDown: 'dropDown',
      entity:entity,
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    };

    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(entity==='Organization'){
          this.menuOptions = response?.data?.listData || [];
          this.loadDropOrg = false;
        }
        if(entity==='Supplier'){
          this.suppList = response?.data?.listData || [];
          this.loadDropSupp = false;
        }

      },
      error: (err) => {
        this.loadDropOrg = false;
        this.loadDropSupp = false;
      }
    });
  }

  private performSearch(term: string,entity:any): void {
    let uri:string='';
    if(entity==='Organization'){
      this.loadDropOrg = true;
      uri= this.baseUrl + '/base/organization/list';
    }
    if(entity==='Supplier'){
      this.loadDropSupp = true;
      uri= this.baseUrl + '/purchase/supplier/list';
    }

    let params: any = {
      commonField: term,
      dropDown: 'dropDown',
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      entity:entity
    };
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(entity==='Organization'){
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
          this.loadDropOrg = false;
        }
        if(entity==='Supplier'){
          this.suppList = response?.data?.listData || [];
          this.hasMoreSupp = this.menuOptions.length === this.pageSize;
          this.loadDropSupp= false;
        }
      },
      error: (err) => {
        this.loadDropOrg = false;
        this.loadDropSupp= false;
      }
    });
  }


}
