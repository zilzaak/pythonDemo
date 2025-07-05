import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../commonService/common-service.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
declare const $: any;
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  public listData:any[]=[];
  public baseUrl=environment.baseUrl;
   searchForm: FormGroup;
   configPgn: any;

  constructor(private commonService : CommonServiceService,   
     private formBuilder: FormBuilder,) { 
      this.configPgn = {
        // my props
        pageNum: 1,
        pageSize: 10,
        totalItem: 50,
        pageSizes: [10, 25, 50, 100, 200, 500, 1000],
        pgnDiplayLastSeq: 10,
        // ngx plugin props
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: 50
      };
      this.searchForm = this.formBuilder.group({
        anyfield:['']
      });
  }

  
  ngOnInit(): void {



  this.getList();

  }



  getList(){

    let queryParams:any={}
    let apiURL=this.baseUrl+'role/list'
    this.listData=[];

 /*
    this.commonService.sendGetRequest(apiURL, queryParams).subscribe(
      (response: any) => {
      this.roleList=response.data;
      },
      (error) => {

      }
    ); */

    let role1:any={
      id:1,
      name:'test role-1',
      description:'role-1'
    };

    let role2:any={
      id:2,
      name:'test role-2',
      description:'role-2'
    };

    let role3:any={
      id:3,
      name:'test role-3',
      description:'role-3'
    }

    this.listData.push(role1,role2,role3)


  }  

 // pagination handling methods start -----------------------------------------------------------------------
 setDisplayLastSequence() {
  this.configPgn.pngDiplayLastSeq = (((this.configPgn.pageNum - 1) * this.configPgn.pageSize) + this.configPgn.pageSize);
  if (this.listData.length < this.configPgn.pageSize) {
    this.configPgn.pngDiplayLastSeq = (((this.configPgn.pageNum - 1) * this.configPgn.pageSize) + this.configPgn.pageSize);
  }
  if (this.configPgn.totalItem < this.configPgn.pngDiplayLastSeq) {
    this.configPgn.pngDiplayLastSeq = this.configPgn.totalItem;
  }
}
handlePageChange(event: number) {

  this.configPgn.pageNum = event;
  // set for ngx
  this.configPgn.currentPage = this.configPgn.pageNum;
  this.getList();
}
handlePageSizeChange(event: any): void {

  this.configPgn.pageSize = event.target.value;
  this.configPgn.pageNum = 1;
  // set for ngx
  this.configPgn.itemsPerPage = this.configPgn.pageSize;
  this.getList();
}
// pagination handling methods end -------------------------------------------------------------------------


}
