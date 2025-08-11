import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  constructor(private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }
  createForm!: FormGroup;
  pageTitle!: any;
  baseUrl = environment.baseUrl;
  roleList: any[]=[];

  ngOnInit(): void {
    this.initializeForm();
    this.fetchRoles();
    this.pageTitle = this.route.snapshot.data['title'];
  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      enabled: [true],
      email: [''],
      phone: [''],
      address: ['', Validators.required],
      displayName: ['', Validators.required],
      roles:['']
    });
  }

  fetchRoles() {
    let api=this.baseUrl+"/base/role/list"
    this.commmonService.getWithToken(api,{}).subscribe(
      { next: (response) => {
        this.roleList = response?.data?.listData;
        console.log("==========================")
        console.log(this.roleList)
        },
        error: (err) => {
        }
      }
    )


  }


  onSubmit() {


  }

}
