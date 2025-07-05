import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from '../../commonService/common-service.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

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
    let apiURL=this.baseUrl+'user/list'
    this.listData=[];

 /*
    this.commonService.sendGetRequest(apiURL, queryParams).subscribe(
      (response: any) => {
      this.roleList=response.data;
      },
      (error) => {

      }
    ); */


    for(let i=1 ;i<5;i++){
      let k:string=i.toString();
      let user1:any={
        id:k,
        userName:'user-'+k,
        email:'school-'+k+'@gmail.com',
        division:'divisition-'+k,
        district:'district-'+k,
        thana:'thana-'+k,
        zipcode:'zipCode-'+k,
        geocode:'geo code-'+k,
        schoolName:'school name-'+k,
        contact:'contact-'+k
  
      };
      this.listData.push(user1);
    }




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
