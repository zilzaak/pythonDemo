import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuItem } from 'src/app/login-module/models/menuItem';

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
        transition('expanded <=> collapsed', animate('600ms ease-in-out')) // Slower animation
      ])
    ]
})

export class Sidebar2Component implements OnInit, OnDestroy {
  permittedMenus!: string; 
  visibleMenus: MenuItem[] = []; 
  activeMenu: string = ''; 
  isSidebarCollapsed: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.permittedMenus = localStorage.getItem('menus') || '';
    this.visibleMenus = this.allMenus.filter(menu => menu.roles.includes(this.permittedMenus));

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

  isActiveRoute(link: string): boolean {
    return this.router.url === link;
  }

  updateActiveMenu(): void {
    const activeMenu = this.visibleMenus.find(menu =>
      menu.submenus.some(submenu => this.router.url === submenu.link)
    );
    this.activeMenu = activeMenu?.title || '';
  }

  // Define all possible menus and submenus
  allMenus: MenuItem[] = [
    {
      title: 'User',
      roles: ['ADMIN', 'SUPER_ADMIN'],
      collapsed: true,
      submenus: [
        { title: 'User List', link: '/user/list' },
        { title: 'Role List', link: '/user/role/list' }
      ]
    },
    {
      title: 'Laptop',
      roles: ['SCHOOL', 'SUPER_ADMIN'],
      collapsed: true,
      submenus: [
        { title: 'List', link: '/school/list' }
      ]
    },
    {
      title: 'Service',
      roles: ['SCHOOL', 'SUPER_ADMIN'],
      collapsed: true,
      submenus: [
        { title: 'List', link: '/service/list' },
      ]
    },
    {
      title: 'Setting',
      roles: ['ADMIN', 'SUPER_ADMIN'],
      collapsed: true,
      submenus: [
        { title: 'Location', link: '/setting/user' },
      ]
    }
  ];
}
