import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginServiceService } from 'src/app/login-module/service/login-service.service';

@Component({
  selector: 'app-sidebar2',
  templateUrl: './sidebar2.component.html',
  styleUrls: ['./sidebar2.component.css'],
    animations: [
      // Sidebar slide-in/out animation
      trigger('slideInOut', [
        state('expanded', style({ width: '250px' })),
        state('collapsed', style({ width: '80px' })),
        transition('expanded <=> collapsed', animate('300ms ease-in-out'))
      ]),
      // Submenu expand/collapse animation
      trigger('expandCollapse', [
        state('expanded', style({ maxHeight: '500px', padding: '10px 0' })),
        state('collapsed', style({ maxHeight: '0px', padding: '0px' })),
        transition('expanded <=> collapsed', animate('600ms ease-in-out'))
      ])
    ]
})

export class Sidebar2Component implements OnInit, OnDestroy { 
  visibleMenus: any[] = []; 
  activeMenu: string = ''; 
  isSidebarCollapsed: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private router: Router,private loginService:LoginServiceService) {}

  ngOnInit(): void {
 
    this.loginService.getMenu().subscribe(
      (menus: any) => {
        this.visibleMenus = menus.data; 
      },); 

    if(!this.visibleMenus){
      this.visibleMenus =[ 
        
        {
        title: 'PURCHASE',
        roles: ['ADMIN', 'SUPER_ADMIN'],
        collapsed: true,
        submenus: [
          { title: 'User List', frontUrl: '/user/list' },
          { title: 'Role List', frontUrl: '/user/role/list' }
        ]
      },


      {
        title: 'INVENTORY',
        roles: ['SCHOOL', 'SUPER_ADMIN'],
        collapsed: true,
        submenus: [
          { title: 'List', frontUrl: '/school/list' }
        ]
      },


      {
        title: 'SALES',
        roles: ['SCHOOL', 'SUPER_ADMIN'],
        collapsed: true,
        submenus: [
          { title: 'List', frontUrl: '/service/list' },
        ]
      },
      {
        title: 'BASE',
        roles: ['ADMIN', 'SUPER_ADMIN'],
        collapsed: true,
        submenus: [
          { title: 'Create', frontUrl: '/base/menu/create' },
          { title: 'List', frontUrl: '/base/menu/list' },
        ]
      },
      {
        title: 'BASE',
        roles: ['ADMIN', 'SUPER_ADMIN'],
        collapsed: true,
        submenus: [
          { title: 'Location', frontUrl: '/setting/user' },
        ]
      }
       ];


    }

    this.router.events
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateActiveMenu();
        }
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete(); 
  }

  getMenuIcon(menuTitle: string): string {
    const iconMap: { [key: string]: string } = {
      PURCHASE: 'fas fa-users', 
      SALES: 'fas fa-laptop', 
      INVENTORY: 'fas fa-cog', 
      ACCOUNTING: 'fas fa-sliders-h',
      BASE: 'fas fa-users'
    };
    
    return iconMap[menuTitle] || 'fas fa-circle'; 
  }

  setActiveMenu(menuTitle: string): void {
    this.activeMenu = menuTitle;
  }

  isActiveRoute(frontUrl: string): boolean {
    return true;
  }

  updateActiveMenu(): void {
    const activeMenu = this.visibleMenus.find(menu =>
      menu.submenus.some((submenu: { frontUrl: string; }) => this.router.url === submenu.frontUrl)
    );
    this.activeMenu = activeMenu?.title || '';
  }

  // Define all possible menus and submenus
}
