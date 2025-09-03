import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
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


  uvalue:any;
  mvalue:any;

  constructor(private commonService:CommonServiceService,    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
 this.initForm();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      parentMenuId:[''],
      backendUrl:[''],
      frontendUrl:['']
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
  if(this.searchForm.value.parentMenuId && this.searchForm.value.parentMenuId!=null 
    && this.searchForm.value.parentMenuId!==''
  ){
    params.parentMenuId=this.searchForm.value.parentMenuId;
  }

  if(this.searchForm.value.backendUrl && this.searchForm.value.backendUrl!=null 
    && this.searchForm.value.backendUrl!==''
  ){
    params.backendUrlId=this.searchForm.value.backendUrl;
  }

  if(this.searchForm.value.frontendUrl && this.searchForm.value.frontendUrl!=null 
    && this.searchForm.value.frontendUrl!==''
  ){
    params.frontendUrl=this.searchForm.value.frontendUrl;
  }

  params.orgId=Number(localStorage.getItem('orgId'));

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
          this.commonService.sendDeleteRequest(this.baseUrl+"/base/module/delete",formData).subscribe({
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

}
