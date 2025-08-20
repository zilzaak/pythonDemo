import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  listData:any[]=[];
  searchForm!:FormGroup;
  baseUrl=environment.baseUrl;
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  constructor(private commonService:CommonServiceService,    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
 this.initForm();
 this.loadPage(1);
  }

  initForm(){

    this.searchForm=this.formBuilder.group({
      parentModule:[''],
      childModule:[''],
      apiPattern:['']
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
  const params = {
    pageNum: page.toString(),
    pageSize: this.pageSize.toString()
  };
    this.commonService.getWithToken('http://localhost:8000/base/module/list', params)
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

  onSearch() {
    this.loadPage(1); // Reset to page 1 on search
  }

  reset() {
    this.searchForm.reset();
    this.loadPage(1);
  }

}
