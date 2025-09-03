import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/login-module/models/menuItem';
import { LoginServiceService } from 'src/app/login-module/service/login-service.service';

@Component({
  selector: 'app-sidebar2',
  templateUrl: './sidebar2.component.html',
  styleUrls: ['./sidebar2.component.css'],
  animations: [
    trigger('slideInOut', [
      state('expanded', style({ width: '250px' })),
      state('collapsed', style({ width: '80px' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ]),
    trigger('expandCollapse', [
      state('expanded', style({ maxHeight: '500px', padding: '10px 0' })),
      state('collapsed', style({ maxHeight: '0px', padding: '0px' })),
      transition('expanded <=> collapsed', animate('600ms ease-in-out'))
    ])
  ]

})
export class Sidebar2Component implements OnInit {
  menuList: MenuItem[] = [];
  organizations:any[]=[];
  loading = true;
  org:any;
  createForm!:FormGroup;

  constructor(private loginService: LoginServiceService,
    private router : Router,
    private formBuilder:FormBuilder
  ) {}

    async ngOnInit():  Promise<void> {
      this.createForm = this.formBuilder.group({org: ['']});
     await this.getMenu();
  }

 async getMenu() {
    let userData:any;
    userData = await this.loginService.userInfo();
    this.menuList=userData.menuList;
    this.organizations=userData.orgList;
    this.loading = false;
    let param:any={
      org:Number(localStorage.getItem('orgId')),
    };
    this.createForm.patchValue(param);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(this.organizations);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(this.createForm.value.org);

  }

  setOrg(orgv:any){  
  localStorage.setItem('orgId',orgv.id.toString());
  localStorage.setItem('orgName',orgv.name);
  console.log(orgv);
  console.log(localStorage.getItem('orgName'));
  }


  logOutUser(){
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    this.router.navigate(['/auth/login']);  
  }

}

