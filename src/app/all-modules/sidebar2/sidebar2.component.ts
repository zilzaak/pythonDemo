import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
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
  loading = true;

  constructor(private loginService: LoginServiceService) {}

  ngOnInit(): void {
    this.getMenu();

  }

  getMenu() {
    this.loginService.getMenu().subscribe({
      next: (menus: any) => {
        this.menuList = menus.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load menus', err);
        this.loading = false;
      }
    });
  }

}

