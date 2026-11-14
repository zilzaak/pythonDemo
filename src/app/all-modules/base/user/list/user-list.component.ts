import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  listData: any[] = [];
  searchForm!: FormGroup;
  baseUrl = environment.baseUrl;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPage(this.currentPage);
  }

  initForm(): void {
    this.searchForm = this.formBuilder.group({
      username: [null],
      commonField: [null]
    });
  }

  getList(): void {
    this.loadPage(this.currentPage);
  }

  reset(): void {
    this.searchForm.reset();
    this.loadPage(1);
  }

  getPageRange(): number[] {
    const maxVisiblePages = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    const range: number[] = [];

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  loadPage(page: number): void {
    if (page < 1) return;

    this.currentPage = page;
    let params: any = {
      pageNum: page.toString(),
      pageSize: this.pageSize.toString()
    };

    if (this.searchForm.value.username && this.searchForm.value.username != null && this.searchForm.value.username !== '') {
      params.username = this.searchForm.value.username;
    }
    if (this.searchForm.value.commonField && this.searchForm.value.commonField != null && this.searchForm.value.commonField !== '') {
      params.commonField = this.searchForm.value.commonField;
    }

    let apiUrl = this.baseUrl + '/base/user/list';
    this.commonService.getWithToken(apiUrl, params).subscribe({
      next: (response) => {
        this.listData = response?.data?.listData || [];
        this.totalItems = response?.data?.totalItems || 0;
        this.totalPages = response?.data?.totalPages || 0;
        this.pageSize = response?.data?.pageSize || this.pageSize;
      },
      error: (err) => {
        console.error('Error loading user list:', err);
        this.listData = [];
      }
    });
  }

}
