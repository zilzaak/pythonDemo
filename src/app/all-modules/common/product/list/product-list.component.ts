import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { LoginServiceService } from 'src/app/login-module/service/login-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  listData:any[]=[];
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  private debounceTimer: any;
  roleList: any;
  username:any;

  loadingu = false;
  loadingDropdownu = false;
  currentPageu = 1;
  pageSizeu = 10;    
  hasMoreu = true; 
  urlOptions:any[]=[];
  userOptions:any[]=[];
  private debounceTimeru: any;


  loadingm = false;
  loadingDropdownm = false;
  currentPagem = 1;
  pageSizem = 10;    
  hasMorem = true; 
  menuOptions:any[]=[];
  private debounceTimerm: any;


  loadingDropdown = false;
  barndLoadingDropDown = false;
  modelLoadingDropDown = false;
  catLoadingDropDown = false;
  colorLoadingDropDown = false;

  sizeLoadingDropDown = false;
  madeLoadingDropDown = false;
  uomLoadingDropDown = false;

  hasMore = true;
  brandHasMore = true;
  modelHasMore = true;
  catHasMore = true;
  colorHasMore = true;
  sizeHasMore = true;
  uomHasMore = true;
  madeHasMore = true;

  catOptions: any[] = [];
  modelOptions: any[] = [];
  colorOptions: any[] = [];
  sizeOptions: any[] = [];
  oumOptions: any[] = [];
  madeWithOptions: any[] = [];
  brandOptions:any[]=[];

  searchItem:any;

  uvalue:any;
  mvalue:any;

  constructor(private commonService:CommonServiceService,  
      private formBuilder: FormBuilder,
    private loginService:LoginServiceService) { }

  async ngOnInit(): Promise<void> {
 let m:any=this.loginService.userInfo();
 let userData:any;
 userData = await this.loginService.userInfo();
 this.menuOptions=userData.orgList;
 this.initForm();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      name:[''],
      catId:[''],
      modelId:[''],
      brandId:[''],
      orgId:[Number(localStorage.getItem('orgId'))]
    })
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

  setSearch(x: any) {
    this.searchItem = x.value;
  }
  loadPage(page: number) {
  if (page < 1 ) return;

  this.currentPage = page;
  let params:any;
  params = {
    pageNum: page.toString(),
    pageSize: this.pageSize.toString()
  };
  console.log("form value is ");
  console.log( this.searchForm.value);
  if(this.searchForm.value.modelId && this.searchForm.value.modelId!=null && this.searchForm.value.modelId!==''
  ){
    params.modelId=this.searchForm.value.modelId;
  }

  if(this.searchForm.value.catId && this.searchForm.value.catId!=null && this.searchForm.value.catId!==''
  ){
    params.catId=this.searchForm.value.catId;
  }

  if(this.searchForm.value.brandId && this.searchForm.value.brandId!=null  && this.searchForm.value.brandId!==''
  ){
    params.brandId=this.searchForm.value.brandId;
  }

  if(this.searchForm.value.orgId && this.searchForm.value.orgId!=null && this.searchForm.value.orgId!==''
  ){
    params.orgId=this.searchForm.value.orgId;
  }

  if(this.searchForm.value.name && this.searchForm.value.name!=null && this.searchForm.value.name!==''
  ){
    params.name=this.searchForm.value.name;
  }
    this.commonService.getWithToken('http://localhost:8000/setting/product/list', params)
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
    this.searchForm.reset();
    this.loadPage(1);
  }


  getList(){
   this.loadPage(this.currentPage);
  }

  getCrud(x: any): string {
    const text = `Create By:${x.createBy} Update By: ${x.updateBy}`;
    return text.length > 40 ? text.substring(0, 30) + '...' : text;
  }
  getCrud2(x: any): string {
    const text = `Org:${x.orgName} Create date :${x.created} Update Date: ${x.updated}`;
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  }

  onSearchu(): void {
    const term = this.uvalue
    console.log("const term = this.uvalue is "+term)
    if (this.debounceTimeru) {
      clearTimeout(this.debounceTimeru);
    }
    if (!term || term.length === 0) {
               this.urlOptions=[];
               console.log("oooooooohhhhhhhhhhhhhh urlOptions is empty  now ")
                 return;
    }
    this.debounceTimeru = setTimeout(() => {
        this.currentPageu = 1;
        this.hasMoreu = true;    
      this.performSearchu();
    }, 300);
  }

  onSearchm(): void {
    const term = this.mvalue;
    console.log("onSearchm()")
    console.log("const term = this.mvalue is "+term)
    if (this.debounceTimerm) {
      clearTimeout(this.debounceTimerm);
    }
    if (!term || term.length === 0) {
        this.menuOptions = [];
        console.log("oooooooohhhhhhhhhhhhhh menuOptions is empty  now ")
        return;
    }
    this.debounceTimerm = setTimeout(() => {
       this.currentPagem = 1;
        this.hasMorem = true;      
      this.performSearchm();
    }, 300);
  }

  setValu(x:any){
    this.uvalue=x.value
  }

  setValm(x:any){
    this.mvalue=x.value
  }

  loadMoreu(): void {
    if (!this.hasMoreu || this.loadingDropdownu) return;
    const term = this.uvalue;
    console.log("loadMoreu() term is  "+term)
    if (!term || typeof term !== 'string') return;
    this.currentPageu++;
    this.loadingDropdownu = true;

   let params: any;

    params= { menu: term,  
       pageNum: this.currentPageu.toString(),
       pageSize: this.pageSizeu.toString(),
       loadMethod:"loadMethod"
      }
  
    let uri=this.baseUrl+"/base/module/list";
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
          this.urlOptions = response?.data?.listData || [];
          this.hasMoreu = this.menuOptions.length === this.pageSizeu;
              this.loadingDropdownu = false;
      },
      error: (err) => {
        this.loadingDropdownu = false; 
      }
    });
  }

  loadMorem(): void {
    if (!this.hasMorem || this.loadingDropdownm) return;
    const term = this.mvalue;
    console.log("loadMorem() term is  "+term)
    if (!term || typeof term !== 'string') return;
    this.currentPagem++;
    this.loadingDropdownm = true;

   let params: any;

    params= { menu: term,  
       pageNum: this.currentPagem.toString(),
       pageSize: this.pageSizem.toString(),
       menuSearch:"menuSearch"
      }
   
    let uri=this.baseUrl+"/base/module/list";
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
          this.menuOptions = response?.data?.listData || [];
          this.hasMorem = this.menuOptions.length === this.pageSizem;
              this.loadingDropdownm = false;
      },
      error: (err) => {
        this.loadingDropdownm = false; 
      }
    });
  }



private performSearchm(): void {
  console.log("performSearchm()()")
this.loadingDropdownm = true;
let uri=this.baseUrl+"/base/module/list";
let params: any;
  params={
    menu: this.mvalue,
    menuSearch:"menuSearch",
    pageNum: this.currentPagem.toString(),
    pageSize: this.pageSizem.toString()
  }
  console.log("params ");
  console.log(params);
this.commonService.getWithToken(uri, params).subscribe({
next: (response) => {
    this.menuOptions = response?.data?.listData || [];
    console.log(this.menuOptions)
    this.hasMorem = this.menuOptions.length === this.pageSizem;
    this.loadingDropdownm = false;  
},
error: (err) => {
  this.loadingDropdownm = false; 
}
});
}


  private performSearchu(): void {
      this.loadingDropdownu = true;  
    let uri=this.baseUrl+"/base/module/list";  
    let params: any;
      params={
        menu: this.uvalue,
        loadMethod:"loadMethod",
        pageNum: this.currentPageu.toString(),
        pageSize: this.pageSizeu.toString()
      }
    
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => { 
          this.urlOptions = response?.data?.listData || [];
          this.hasMoreu = this.urlOptions.length === this.pageSizeu;
          this.loadingDropdownu = false;       
      },
      error: (err) => {
        this.loadingDropdownu = false; 
      }
    });
  }

  setUser(){
    for(let k of this.userOptions){
    if(k.userId===this.searchForm.value.userId){
    this.username=k.username;
     break;
    }
    }
      }

      deleteMenu(x:any){
        let formData:any={
          id:x
        };
          this.commonService.sendDeleteRequest(this.baseUrl+"/setting/product/delete",formData).subscribe({
          next: (response: any) => {
            if (response.success) {
              alert(response.message);
              this.ngOnInit();
            } else {
              alert(response.message);
            }
          },
          error: () => {
          }
        });

      }


      
  onBrandSearch(event: any, entity: any): void {
    const term = event.term?.trim();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (!term || term.length === 0) {
      if (entity === 'Brand') {
        this.brandOptions = [];
      } else if (entity === 'ProductModel') {
        this.modelOptions = [];
      }
      else if (entity === 'ProductCat') {
        this.catOptions = [];
      }
      else if (entity === 'ProductColor') {
        this.colorOptions = [];
      }
      else if (entity === 'ProductSize') {
        this.sizeOptions = [];
      }
      else if (entity === 'MadeWith') {
        this.madeWithOptions = [];
      }
      else if (entity === 'UnitOfMeasure') {
        this.oumOptions = [];
      }
      return;
    }
    this.debounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.brandHasMore = true;
      this.brandPerformSearch(term, entity);
    }, 300);
  }

  brandLoadMore(entity: any): void {

    if (entity === 'Brand') {
      if (!this.brandHasMore || this.barndLoadingDropDown) {
        return;
      } else {
        this.barndLoadingDropDown = true;
      }
    } else if (entity === 'ProductModel') {
      if (!this.modelHasMore || this.modelLoadingDropDown) {
        return;
      } else {
        this.modelLoadingDropDown = true;
      }
    }
    else if (entity === 'ProductCat') {
      if (!this.catHasMore || this.catLoadingDropDown) {
        return;
      } else {
        this.catLoadingDropDown = true;
      }
    }
    else if (entity === 'ProductColor') {
      if (!this.colorHasMore || this.colorLoadingDropDown) {
        return;
      } else {
        this.colorLoadingDropDown = true;
      }
    }
    else if (entity === 'ProductSize') {
      if (!this.sizeHasMore || this.sizeLoadingDropDown) {
        return;
      } else {
        this.sizeLoadingDropDown = true;
      }
    }
    else if (entity === 'MadeWith') {
      if (!this.madeHasMore || this.madeLoadingDropDown) {
        return;
      } else {
        this.madeLoadingDropDown = true;
      }
    }
    else if (entity === 'UnitOfMeasure') {
      if (!this.uomHasMore || this.uomLoadingDropDown) {
        return;
      } else {
        this.uomLoadingDropDown = true;
      }
    }

    const term = this.searchItem;
    if (!term || typeof term !== 'string') return;
    this.currentPage++;

    let params: any = {
      name: term,
      entity: entity,
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    }

    let uri = this.baseUrl + "/setting/productCriteria/list";
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if (entity === 'Brand') {
          this.brandOptions = response?.data?.listData;
          this.barndLoadingDropDown = false;
        } else if (entity === 'ProductModel') {
          this.modelOptions = response?.data?.listData;
          this.modelLoadingDropDown = false;
        }
        else if (entity === 'ProductCat') {
          this.catOptions = response?.data?.listData;
          this.catLoadingDropDown = false;
        }
        else if (entity === 'ProductColor') {
          this.colorOptions = response?.data?.listData;
          this.colorLoadingDropDown = false;
        }
        else if (entity === 'ProductSize') {
          this.sizeOptions = response?.data?.listData;
          this.sizeLoadingDropDown = false;
        }
        else if (entity === 'MadeWith') {
          this.madeWithOptions = response?.data?.listData;
          this.madeLoadingDropDown = false;
        }
        else if (entity === 'UnitOfMeasure') {
          this.oumOptions = response?.data?.listData;
          this.uomLoadingDropDown = false;
        }
      },
      error: (err) => {
        if (entity === 'Brand') {
          this.barndLoadingDropDown = false;

        } else if (entity === 'ProductModel') {
          this.modelLoadingDropDown = false;
        }
        else if (entity === 'ProductCat') {
          this.catLoadingDropDown = false;
        }
        else if (entity === 'ProductColor') {
          this.colorLoadingDropDown = false;
        }
        else if (entity === 'ProductSize') {
          this.sizeLoadingDropDown = false;

        }
        else if (entity === 'MadeWith') {
          this.madeLoadingDropDown = false;
        }
        else if (entity === 'UnitOfMeasure') {
          this.uomLoadingDropDown = false;
        }
      }
    });
  }

  private brandPerformSearch(term: string, entity: any): void {
    if (entity === 'Brand') {
      this.barndLoadingDropDown = true;
    } else if (entity === 'ProductModel') {
      this.modelLoadingDropDown = true;
    }
    else if (entity === 'ProductCat') {
      this.catLoadingDropDown = true;
    }
    else if (entity === 'ProductColor') {
      this.colorLoadingDropDown = true;
    }
    else if (entity === 'ProductSize') {
      this.sizeLoadingDropDown = true;
    }
    else if (entity === 'MadeWith') {
      this.madeLoadingDropDown = true;
    }
    else if (entity === 'UnitOfMeasure') {
      this.uomLoadingDropDown = true;
    }

    let uri = this.baseUrl + "/setting/productCriteria/list";
    let params: any = {
      entity: entity,
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString(),
      name: this.searchItem,
      orgId: this.searchForm.value.orgId
    }
    this.commonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if (entity === 'Brand') {
          this.brandOptions = response?.data?.listData;
          this.brandHasMore = this.brandOptions.length === this.pageSize;
          this.barndLoadingDropDown = false;
        } else if (entity === 'ProductModel') {
          this.modelOptions = response?.data?.listData;
          this.modelHasMore = this.modelOptions.length === this.pageSize;
          this.modelLoadingDropDown = false;
        }
        else if (entity === 'ProductCat') {
          this.catOptions = response?.data?.listData;
          this.catHasMore = this.catOptions.length === this.pageSize;
          this.catLoadingDropDown = false;
        }
        else if (entity === 'ProductColor') {
          this.colorOptions = response?.data?.listData;
          this.colorHasMore = this.colorOptions.length === this.pageSize;
          this.colorLoadingDropDown = false;
        }
        else if (entity === 'ProductSize') {
          this.sizeOptions = response?.data?.listData;
          this.sizeHasMore = this.sizeOptions.length === this.pageSize;
          this.sizeLoadingDropDown = false;
        }
        else if (entity === 'MadeWith') {
          this.madeWithOptions = response?.data?.listData;
          this.madeHasMore = this.madeWithOptions.length === this.pageSize;
          this.madeLoadingDropDown = false;
        }
        else if (entity === 'UnitOfMeasure') {
          this.oumOptions = response?.data?.listData;
          this.uomHasMore = this.oumOptions.length === this.pageSize;
          this.uomLoadingDropDown = false;
        }
      },
      error: (err:any) => {
        this.barndLoadingDropDown = false;
        this.modelLoadingDropDown = false;
        this.catLoadingDropDown = false;
        this.colorLoadingDropDown = false;
        this.sizeLoadingDropDown = false;
        this.madeLoadingDropDown = false;
        this.uomLoadingDropDown = false;

      }
    });
  }

}
