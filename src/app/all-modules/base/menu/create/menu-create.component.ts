import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

interface MenuOption {
  id: number;
  name: string;
}

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

  menuOptions: MenuOption[] = [];
  loadingDropdown = false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;

  private debounceTimer: any; // For debouncing input

  constructor(
    private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
    const payload = { ...this.createForm.value };
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

  // ✅ Called when user types in ng-select
  onSearch(event: any): void {
    const term = event.term?.trim();

    // Clear previous debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Reset if empty
    if (!term || term.length === 0) {
      this.menuOptions = [];
      return;
    }

    // Debounce: wait 300ms before calling API
    this.debounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.menuOptions = [];
      this.hasMore = true;
      this.performSearch(term);
    }, 300);
  }

  // ✅ Load more when user scrolls to end
  loadMore(): void {
    if (!this.hasMore || this.loadingDropdown) return;

    const term = this.createForm.get('menu')?.value?.trim();
    if (!term || typeof term !== 'string') return;

    this.currentPage++;
    this.loadingDropdown = true;

    this.http
      .get<MenuOption[]>(this.baseUrl + '/base/menu/search', {
        params: {
          q: term,
          page: this.currentPage.toString(),
          size: this.pageSize.toString()
        }
      })
      .subscribe(
        (results: MenuOption[]) => {
          if (Array.isArray(results)) {
            this.menuOptions = [...this.menuOptions, ...results];
            this.hasMore = results.length === this.pageSize;
          } else {
            this.hasMore = false;
          }
          this.loadingDropdown = false;
        },
        (error) => {
          console.error('Load more failed', error);
          this.loadingDropdown = false;
        }
      );
  }

  // ✅ Perform initial search
  private performSearch(term: string): void {
    this.loadingDropdown = true;

    this.http
      .get<MenuOption[]>(this.baseUrl + '/base/menu/search', {
        params: {
          q: term,
          page: this.currentPage.toString(),
          size: this.pageSize.toString()
        }
      })
      .subscribe(
        (results: MenuOption[]) => {
          this.menuOptions = Array.isArray(results) ? results : [];
          this.hasMore = this.menuOptions.length === this.pageSize;
          this.loadingDropdown = false;
        },
        (error) => {
          console.error('Search failed', error);
          this.loadingDropdown = false;
        }
      );
  }
}