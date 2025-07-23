import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'src/app/login-module/service/login-service.service';
import { CommonServiceService } from '../../commonService/common-service.service';
import { MenuItem } from 'src/app/login-module/models/menuItem';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private actveRouter:ActivatedRoute,
    private router:Router
  ){

  }

  ngOnInit(): void {
    
    this.checkLogin();
  }


  checkLogin(){
    let jwtToken:any;
    jwtToken=localStorage.getItem('jwtToken');
    if(!jwtToken || jwtToken===undefined || jwtToken==null){
      this.router.navigate(['/dashboard/auth/login']); 
    }

  }
  
}
