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

  loadingDropdown = false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  menuOptions:any[]=[];

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
    });
  }

  onSubmit() {
    if (this.opMode === 'view') return;

    this.loading = true;
    const payload = { ...this.createForm.value};
    const method = this.opMode === 'create' ? 'post' : 'put';

    this.commmonService.sendPostPutReq<any>(this.api, payload, method).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/base/menu/list']);
        } else {
          alert(response.message);
          this.router.navigate(['/base/menu/list']);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
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

    const term = this.createForm.get('menu')?.value?.trim();
    if (!term || typeof term !== 'string') return;
    this.currentPage++;
    this.loadingDropdown = true;
   let params: any={
      menu: term,
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    }

    let uri=this.baseUrl+"/base/module/list";
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


  private performSearch(term: string): void {
    this.loadingDropdown = true;
    let uri=this.baseUrl+"/base/module/list";
    let params: any={
      menu: term,
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