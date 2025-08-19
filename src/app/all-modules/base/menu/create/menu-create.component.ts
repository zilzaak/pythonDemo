import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css']
})
export class MenuCreateComponent implements OnInit {
  createForm!: FormGroup;
  pageTitle!: any;
  opMode!: any;
  api!: any;
  baseUrl = environment.baseUrl;
  loading = false;
  showSaveBtn: boolean = true;
  listData:any[]=[];
  methodNames:any[]=['POST','PUT','PATCH','DELETE','GET'];
  loadingDropdown = false;
  loadingDropdown2 = false;
  currentPage = 1;  currentPage2 = 1;
  pageSize = 10;    pageSize2 = 10;
  hasMore = true;   hasMore2 = true;
  menuOptions:any[]=[];
  menuParents:any[]=[];
  private debounceTimer: any;

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
      this.api = this.baseUrl + '/base/module/create';
    } else if (this.pageTitle === 'Edit') {
      this.opMode = 'edit';
      this.api = this.baseUrl + '/base/module/update';
      this.formData(this.activeRouter.snapshot.params.id);
    } else if (this.pageTitle === 'View') {
      this.opMode = 'view';
      this.api = this.baseUrl + '/base/module/get';
      this.createForm?.controls['authority'].disable();
      this.createForm?.controls['remarks'].disable();
      this.showSaveBtn = false;
    }
  }




  formData(id: any) {
    const para = { id };
    const api = this.baseUrl + '/base/module/get';
    this.commmonService.getWithToken(api, para).subscribe({
      next: (response) => {
        this.createForm.patchValue(response);
      },
      error: (err) => {
        console.error('Failed to load data', err);
      }
    });
  }




  initializeForm() {
    this.createForm = this.formBuilder.group({
      id: [''],
      frontUrl: [''],
      menu: [''],
      parentMenu: [''],
      apiPattern: [''],
      methodName: [''],
      apiSeq: [''],
      parentId:[''],
    });
  }

  onSubmit() {
    if (this.opMode === 'view') return;

    this.loading = true;
    const payload = { ...this.createForm.value};
    const method = this.opMode === 'create' ? 'post' : 'put';

    console.log("============================");
    console.log(payload);

    // this.commmonService.sendPostPutReq<any>(this.api, payload, method).subscribe({
    //   next: (response: any) => {
    //     if (response.success) {
    //       this.router.navigate(['/base/menu/list']);
    //     } else {
    //       alert(response.message);
    //       this.router.navigate(['/base/menu/list']);
    //     }
    //   },
    //   error: () => {
    //     this.loading = false;
    //   }
    // });
  }




  onSearch(event: any,menu:any): void {
    const term = event.term?.trim();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (!term || term.length === 0) {
      if(menu==='menu'){
        this.menuOptions = [];
      }else{
        this.menuParents = [];
      }
     return;
    }
    this.debounceTimer = setTimeout(() => {
      if(menu==='menu'){
        this.currentPage = 1;
        this.hasMore = true;
      }else{
        this.currentPage2 = 1;
        this.hasMore2 = true;
      }

      this.performSearch(term,menu);
    }, 300);
  }

  loadMore(menu:any): void {
    if (!this.hasMore || this.loadingDropdown) return;

    const term = this.createForm.get('menu')?.value?.trim();
    if (!term || typeof term !== 'string') return;
    this.currentPage++;
    this.loadingDropdown = true;
   let params: any={ menu: term,  pageNum: this.currentPage.toString(), pageSize: this.pageSize.toString()
    }

    let uri=this.baseUrl+"/base/module/list";
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(menu==='parent'){
          this.menuParents=response?.data?.listData || [];
          this.hasMore = this.menuParents.length === this.pageSize;
        }
        if(menu==='menu'){
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
        }
        this.loadingDropdown = false;
      },
      error: (err) => {
        this.loadingDropdown = false; 
      }
    });
  }


  private performSearch(term: string,menu:any): void {
    
    if(menu==='menu'){
      this.loadingDropdown = true;
    }else{
      this.loadingDropdown2 = true;
    }

    let uri=this.baseUrl+"/base/module/list";
    let params: any={
      menu: term,
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    }
    this.commmonService.getWithToken(uri, params).subscribe({
      next: (response) => {
        if(menu==='parent'){
          this.menuParents=response?.data?.listData || [];
          this.hasMore2 = this.menuParents.length === this.pageSize;
          this.loadingDropdown2 = false; 
        }
        if(menu==='menu'){
          this.menuOptions = response?.data?.listData || [];
          this.hasMore = this.menuOptions.length === this.pageSize;
          this.loadingDropdown = false; 
        }

        if(this.opMode==='create' &&  menu==='menu' &&  this.menuOptions.length < 1  ){
           this.menuOptions=[
            {"moduleName":term,
            "ddlCode":term,
            "id":null}
           ]
        }
      },
      error: (err) => {
        this.loadingDropdown = false; 
      }
    });
  }

  setId(){
    let menu:any=this.createForm.value.menu;
    for(let obj of this.menuOptions){
        if(menu===obj.moduleName){
          this.createForm.controls['id'].setValue(obj.id);
          break;
        } 
    }
  }
  setParentId(){
    let menu:any=this.createForm.value.parentMenu;
    for(let obj of this.menuParents){
        if(menu===obj.moduleName){
          this.createForm.controls['parentId'].setValue(obj.id);
          break;
        } 
    } 
  }
}