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
  @ViewChild('prchButton') prchButton!: ElementRef;

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
  loadInv=false;
  loadDropSupp = false;
  loadDropPro = false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  hasMoreSupp = true;
  hasMoreInv=true;
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

  showCriteriaPopup: boolean = false;
  currentPopupType: string = ''; // store which dropdown triggered the popup
   openCriteriaPopup(type: string) {
    this.currentPopupType = type; 
    this.showCriteriaPopup = true;
  }
  
  closeCriteriaPopup() {
    this.showCriteriaPopup = false;
  }


  onCriteriaAdded(newItem: any) {
    this.showCriteriaPopup = false;
    switch(this.currentPopupType) {
      case '':
        this.suppList.push(newItem);
        break;
    }
  }

  ngOnInit(): void {
    this.stocks.push(50,50,450,120,22,45);
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

  loadAllBranch() {
    let org: any = this.createForm.value.orgId;
    const para = { entity: 'Branch', orgId: org, pageNum: 1, pageSize: 50 };
    this.commmonService.getWithToken(this.baseUrl + '/base/organization/list', para).subscribe({
      next: (response) => {
        this.branchList = response.data.listData;
      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    });
  }


  ngAfterViewInit() {
    console.log('Button element:', this.prchButton.nativeElement);
  }

  formData(id: any) {
    this.id = id;
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
          this.purchaseForm.disable();
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
      orgId: [Number(localStorage.getItem('orgId')), [Validators.required, Validators.maxLength(100)]],
      branchId: [null],
      inventoryId: [''],
      supplierId: [''],
      confirmSimilarity: [false]
    });
    this.selectForm=this.formBuilder.group({
      product: ['']
    });
    this.purchaseForm = this.formBuilder.group(
      {
        purchPrices: this.formBuilder.array([this.sellPriceCreate(null)])
      }
    );
  }

  sellPriceCreate(obj:any): FormGroup {
    if(obj==null){
      return this.formBuilder.group({
        quantity:['',Validators.required],
        productId:['',Validators.required],
        productType:[''],
        unitPrice:['',Validators.required],
        purchaseId:[''],
        productName:[''],
        productCode:[''],
        disAmount:[''],
        disPct:[''],
        vatPct:[''],
        vatAmount:[''],
        netAmount:[''],
        totalAmount:['',Validators.required],
     })
    }else{
      return this.formBuilder.group({
        quantity:['',Validators.required],
        productId:[obj.id],
        productType:[''],
        unitPrice:[obj.unitPrice],
        purchaseId:[''],
        productName:[obj.productName],
        productCode:[obj.code],
        disAmount:[''],
        disPct:[''],
        vatPct:[''],
        vatAmount:[''],
        netAmount:[''],
        totalAmount:['',Validators.required],
     })
    }

  }
  get allPurchs(): FormArray {
    return this.purchaseForm.get("purchPrices") as FormArray;
  }

  addSell(index: number): void {
    this.allPurchs.insert(index, this.sellPriceCreate(null));
    this.calculateAll();
  }

  removeSell(index: any): void {
    this.allPurchs.removeAt(index);
    this.calculateAll();
  }


  confirmSimilarity() {
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

    let spi: any = {
      purchPrices: null,
      sellBranchIds: null,
      costPrices: null,
      costBranchIds: null,
    };

    for (let hb of this.purchaseForm.value.purchPrices) {
      if (spi.sellBranchIds == null) {
        spi.sellBranchIds = hb.branchId.toString();
        spi.purchPrices = hb.price.toString();
      } else {
        spi.sellBranchIds = spi.sellBranchIds.toString() + "," + hb.branchId.toString();
        spi.purchPrices = spi.purchPrices.toString() + "," + hb.price.toString();
      }
    }

    let method = this.opMode === 'create' ? 'post' : 'put';
    this.commmonService.sendPostPutReq<any>(this.api.toString(), payload, method).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/common/product/list']);
        } else {
          if (response.message.includes('Similar')) {
            this.similarProduct = response.data.existsData;
            this.prchButton.nativeElement.click();
          } else {
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


  setProductDetails(obj:any){
    if(obj===undefined || obj==null){
       return;
    }

    if(this.purchaseForm.value.purchPrices.length<1){
      this.allPurchs.push(this.sellPriceCreate(obj));
      return;
    }

    if(this.purchaseForm.value.purchPrices.length===1 && 
      ( !this.purchaseForm.value.purchPrices[0].productId || 
        this.purchaseForm.value.purchPrices[0].productId==null
      )
     ){
      this.removeSell(0);
      this.allPurchs.push(this.sellPriceCreate(obj));
      return;
    }

    if(this.purchaseForm.value.purchPrices.length>0){        
      for(let hb of this.purchaseForm.value.purchPrices){
        if(hb.productId && hb.productId!=undefined && hb.productId!=null && hb.productId!=='' &&
          obj.id && obj.id!=undefined && obj.id!=null && obj.id!==''
          && Number(obj.id.toString())==Number(hb.productId.toString())){
          return;
         }   
      }
     this.allPurchs.push(this.sellPriceCreate(obj));
    }
  
  }


  onSearch(entity: any): void {
    let term:any = this.searchItem;
    if(this.searchItem==undefined || this.searchItem===''){
      term=null;
    }
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
      if (entity === 'Inventory') {
        this.hasMoreInv = true;
      }

      this.performSearch(term, entity);
    }, 300);
  }

  loadMore(entity: any): void {
    let term:any = this.searchItem;
    if( this.searchItem==undefined ||  this.searchItem===''){
      term=null;
    }
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
    if (entity === 'Inventory') {
      this.loadInv = true;
      uri = this.baseUrl + '/inventory/list';
    }

    let params: any = {
      dropDown: 'dropDown',
      branchId:this.createForm.value.branchId,
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      entity: entity,
      name:term,
      orgId:this.createForm.value.orgId
    };

    if(term!=null){
     params.commonField=term;
    }

    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if (entity === 'Organization') {
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
          this.loadDropOrg = false;
        }
        if (entity === 'Supplier') {
          this.suppList=[];
          this.suppList = response.data.listData;
          this.hasMoreSupp = this.suppList.length === this.pageSize;
          this.loadDropSupp = false;
        }
        if (entity === 'Product') {
          this.products = response?.data?.listData || [];
          this.hasMorePro = this.products.length === this.pageSize;
          this.loadDropPro = false;
        }
        if (entity === 'Inventory') {
          this.invList = [];
          this.invList=response?.data?.listData;
          this.hasMoreInv = this.invList.length === this.pageSize;
          this.loadInv = false;
        }
      },
      error: (err) => {
        this.loadDropOrg = false;
        this.loadDropSupp = false;
        this.loadDropPro = false;
      }
    });
  }


  setVat(type:any,index:any){
    let i:number=Number(index.toString());
    let unitPrice:any= (this.allPurchs.at(i) as FormGroup).get('unitPrice')?.value;
    if(!unitPrice || unitPrice===undefined || unitPrice==null || unitPrice===''){
      unitPrice=0;
    }
    let quantity:any= (this.allPurchs.at(i) as FormGroup).get('quantity')?.value;
    if(!quantity || quantity===undefined || quantity==null || quantity===''){
      quantity=0;
    }
    let disAmount:any= (this.allPurchs.at(i) as FormGroup).get('disAmount')?.value;
    if(!disAmount || disAmount===undefined || disAmount==null || disAmount===''){
      disAmount=0;
    }
    let totalPrice:any=quantity*unitPrice;
    
    let vatAmount:any=0;
    let vatPct:any=0;
    let netAmount:any=totalPrice-disAmount;

    if(type==='amount'){
      vatAmount=(this.allPurchs.at(i) as FormGroup).get('vatAmount')?.value;
      vatPct=(vatAmount/netAmount)*100;
    }else{
      vatPct=(this.allPurchs.at(i) as FormGroup).get('vatPct')?.value;
      vatAmount=(vatPct/100)*netAmount;
    }

    let totalAmount:any=netAmount+vatAmount;
    vatAmount=(vatAmount>0)?vatAmount:'';
    vatPct=(vatPct>0)?vatPct:'';
    (this.allPurchs.at(i) as FormGroup).patchValue({
      vatAmount: vatAmount,
      vatPct: vatPct,
      netAmount:netAmount,
      totalAmount:totalAmount
    }); 
    this.calculateAll();

  }

  calculateData(index:any){
    let i:number=Number(index.toString());
    let unitPrice:any=(this.allPurchs.at(i) as FormGroup).get('unitPrice')?.value;
    let quantity:any=(this.allPurchs.at(i) as FormGroup).get('quantity')?.value; 
   if(!unitPrice || unitPrice===undefined || unitPrice==null || unitPrice===''){
      unitPrice=0;
    }
    if(!quantity || quantity===undefined || quantity==null || quantity===''){
      quantity=0;
    }
    let disPct:any= (this.allPurchs.at(i) as FormGroup).get('disPct')?.value;
    if(!disPct || disPct===undefined || disPct==='' || disPct==null){
      disPct=0;
    }
    let vatPct:any=(this.allPurchs.at(i) as FormGroup).get('vatPct')?.value;
    if(!vatPct || vatPct===undefined || vatPct==='' || vatPct==null){
      vatPct=0;
    }
    let totalPrice:any=quantity*unitPrice;
    let disAmount:any=(disPct/100)*totalPrice;
    let netAmount:any=totalPrice-disAmount;
    let vatAmount:any=(vatPct/100)*netAmount;;
    let totalAmount:any=netAmount+vatAmount;

    vatAmount=(vatAmount>0)?vatAmount:'';
    vatPct=(vatPct>0)?vatPct:'';
    disAmount=(disAmount>0)?disAmount:'';
    disPct=(disPct>0)?disPct:'';

    (this.allPurchs.at(i) as FormGroup).patchValue({
      vatAmount: vatAmount,
      vatPct: vatPct,
      disAmount:disAmount,
      disPct:disPct,
      netAmount:netAmount,
      totalAmount:totalAmount
    });
    this.calculateAll();
  }

  calculateAll(){
     this.priceSum=0;
     this.totalNetPrice=0;
     this.pricePayable=0; 
     this.totalDiscount=0;
     this.totalVat=0;

    let i:number=0;
    for (let hb of this.purchaseForm.value.purchPrices) {
                i++;
                if(i<2){
                    this.priceSum=hb.unitPrice*hb.quantity;
                    this.totalDiscount=hb.disAmount;
                    this.totalVat=hb.vatAmount;
                }else{
                  this.priceSum=this.priceSum+hb.unitPrice*hb.quantity;
                  this.totalDiscount=this.totalDiscount+hb.disAmount;
                  this.totalVat=this.totalVat+hb.vatAmount;
                }
        }
        this.totalNetPrice=this.priceSum-this.totalDiscount;
        this.pricePayable=this.totalNetPrice+this.totalVat;
  }

  setDiscount(type:any,index:any){
    let i:number=Number(index.toString());
    let unitPrice:any= (this.allPurchs.at(i) as FormGroup).get('unitPrice')?.value;
    if(!unitPrice || unitPrice===undefined || unitPrice==null || unitPrice===''){
      unitPrice=0;
    }
    let quantity:any= (this.allPurchs.at(i) as FormGroup).get('quantity')?.value;
    if(!quantity || quantity===undefined || quantity==null || quantity===''){
      quantity=0;
    }
    let totalPrice:any=quantity*unitPrice;    
    let disAmount:any=0;
    let disPct:any=0;
    if(type==='amount'){
      disAmount=(this.allPurchs.at(i) as FormGroup).get('disAmount')?.value;
      disPct=(disAmount/totalPrice)*100;
    }else{
      disPct=(this.allPurchs.at(i) as FormGroup).get('disPct')?.value;
      disAmount=(disPct/100)*totalPrice;
    }
    let netAmount:any=totalPrice-disAmount;

    let vatAmount:any= (this.allPurchs.at(i) as FormGroup).get('vatAmount')?.value;
    if(!vatAmount || vatAmount===undefined || vatAmount==null || vatAmount===''){
      vatAmount=0;
    }

    let totalAmount:any=netAmount+vatAmount;
    disAmount=(disAmount>0)?disAmount:'';
    disPct=(disPct>0)?disPct:'';
    (this.allPurchs.at(i) as FormGroup).patchValue({
      disAmount: disAmount,
      disPct: disPct,
      netAmount:netAmount,
      totalAmount:totalAmount
    }); 
    this.calculateAll();
  }





}
