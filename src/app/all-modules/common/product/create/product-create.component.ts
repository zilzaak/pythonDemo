import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  createForm!: FormGroup;
  pageTitle!: any;
  opMode!: any;
  api!: any;
  baseUrl = environment.baseUrl;
  loading = false;
  listData: any[] = [];
  entities: any[] = ['Brand', 'ProductCat', 'ProductModel', 'ProductColor', 'ProductSize', 'MadeWith', 'UnitOfMeasure'];
  loadingDropdown = false;
  barndLoadingDropDown = false;
  modelLoadingDropDown = false;
  catLoadingDropDown = false;
  colorLoadingDropDown = false;

  sizeLoadingDropDown = false;
  madeLoadingDropDown = false;
  uomLoadingDropDown = false;

  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  brandHasMore = true;
  modelHasMore = true;
  catHasMore = true;
  colorHasMore = true;
  sizeHasMore = true;
  uomHasMore = true;
  madeHasMore = true;

  menuOptions: any[] = [];
  brandOptions: any[] = [];
  private debounceTimer: any;
  searchItem: any;

  catOptions: any[] = [];
  modelOptions: any[] = [];
  colorOptions: any[] = [];
  sizeOptions: any[] = [];
  oumOptions: any[] = [];
  madeWithOptions: any[] = [];

  constructor(
    private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];

    if (this.pageTitle === 'Create') {
      this.menuOptions = [
        {
          id: Number(localStorage.getItem('orgId')),
          orgName: localStorage.getItem('orgName')
        }
      ]
      this.opMode = 'create';
      this.api = this.baseUrl + '/setting/product/create';
    } else if (this.pageTitle === 'Edit') {
      this.opMode = 'edit';
      this.api = this.baseUrl + '/setting/product/update';
      this.formData(this.activeRouter.snapshot.params.id, this.activeRouter.snapshot.params.entity);
    } else if (this.pageTitle === 'View') {
      this.opMode = 'view';
      this.api = this.baseUrl + '/setting/product/list';
      this.formData(this.activeRouter.snapshot.params.id, this.activeRouter.snapshot.params.entity);
    }
  }


  formData(id: any, entity: any) {
    let org: any = localStorage.getItem('orgId');
    const para = { id: id, entity: entity, orgId: org };
    this.commmonService.getWithToken(this.baseUrl + '/setting/productCriteria/list', para).subscribe({
      next: (response) => {
        this.menuOptions = [
          {
            id: localStorage.getItem('orgId'), orgName: localStorage.getItem('orgName')
          }
        ];
        this.createForm.patchValue(response.data.listData[0]);
        this.createForm.controls['entity'].setValue(entity);
        this.createForm.controls['orgId'].setValue(localStorage.getItem('orgId'));
        this.brandOptions = [
          {
            id: response.data.listData[0]?.brandId,
            name: response.data.listData[0]?.brandName,
          }
        ]

        if (this.opMode === 'view') {
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
      name: ['', [Validators.required, Validators.maxLength(100)]],
      orgId: [Number(localStorage.getItem('orgId'))],
      catId: [null],
      brandId: [null],
      modelId: [null],
      sizeId: [null],
      colorId: [null],
      madeWithId: [null],
      uomId: [null],
      qtyPerUnit: [null, [Validators.min(0)]],
      unitName: ['', [Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    if (this.opMode === 'view') return;
    if (this.createForm.invalid) {
      alert("Invalid form");
      return;
    }
    this.loading = true;
    let payload: any = { ...this.createForm.value };
    let method = this.opMode === 'create' ? 'post' : 'put';
    this.commmonService.sendPostPutReq<any>(this.api.toString(), payload, method).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/common/product/list']);
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
      dropDown: "dropDown",
      pageNum: this.currentPage.toString(),
      pageSize: this.pageSize.toString()
    }

    let uri = this.baseUrl + "/base/organization/list";
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
    let uri = this.baseUrl + "/base/organization/list";
    let params: any = {
      commonField: term,
      dropDown: "dropDown",
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
    this.commmonService.getWithToken(uri, params).subscribe({
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
      orgId: this.createForm.value.orgId
    }
    this.commmonService.getWithToken(uri, params).subscribe({
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
      error: (err) => {
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

