import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/login-module/models/menuItem';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.css']
})
export class ItemMenuComponent implements OnInit {

  @Input() menu!: MenuItem;
  @Input() level: number = 0;
  expandedMenus: { [id: string]: boolean } = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.menu && this.menu.details && this.menu.details.length > 0) {
      if (this.hasActiveChild(this.menu)) {
        this.expandedMenus[this.menu.id] = true;
      }
    }
  }

  hasActiveChild(item: MenuItem): boolean {
    if (!item.details || item.details.length === 0) return false;
    const currentUrl = this.router.url;
    return item.details.some(child => {
      if (child.frontUrl && currentUrl.startsWith(child.frontUrl)) {
        return true;
      }
      return this.hasActiveChild(child);
    });
  }

  checkUrl(menu: MenuItem): boolean {
    return true;
  }

  toggleMenu(menuId: string): void {
    this.expandedMenus[menuId] = !this.expandedMenus[menuId];
  }

  isMenuExpanded(menuId: string): boolean {
    return !!this.expandedMenus[menuId];
  }

  getMenuIcon(menu: MenuItem): string {
    if (menu?.icon && menu.icon.trim() !== '') {
      return menu.icon;
    }

    const title = (menu?.menu || '').toLowerCase().trim();
    const url = (menu?.frontUrl || '').toLowerCase().trim();

    if (title.includes('dashboard') || url.includes('dashboard')) {
      return 'fas fa-tachometer-alt';
    }
    if (title.includes('user') || url.includes('/user')) {
      return 'fas fa-users';
    }
    if (title.includes('role') || url.includes('/role')) {
      return 'fas fa-user-tag';
    }
    if (title.includes('perm') || url.includes('perm')) {
      return 'fas fa-user-shield';
    }
    if (title.includes('org') || title.includes('company') || url.includes('/org')) {
      return 'fas fa-building';
    }
    if (title.includes('branch') || url.includes('/branch')) {
      return 'fas fa-code-branch';
    }
    if (title.includes('base') || url.includes('/base')) {
      return 'fas fa-sliders-h';
    }
    if (title.includes('menu') || url.includes('/menu')) {
      return 'fas fa-bars';
    }
    if (title.includes('inventory') || title.includes('stock') || url.includes('inventory')) {
      return 'fas fa-warehouse';
    }
    if (title.includes('product') || title.includes('item') || url.includes('product') || url.includes('item')) {
      return 'fas fa-box-open';
    }
    if (title.includes('category') || url.includes('category')) {
      return 'fas fa-tags';
    }
    if (title.includes('brand') || url.includes('brand')) {
      return 'fas fa-copyright';
    }
    if (title.includes('unit') || url.includes('unit')) {
      return 'fas fa-ruler-combined';
    }
    if (title.includes('purchase') || url.includes('purchase')) {
      return 'fas fa-shopping-bag';
    }
    if (title.includes('supplier') || title.includes('vendor') || url.includes('supplier')) {
      return 'fas fa-truck';
    }
    if (title.includes('customer') || title.includes('client') || url.includes('customer')) {
      return 'fas fa-user-friends';
    }
    if (title.includes('sale') || url.includes('sales')) {
      return 'fas fa-shopping-cart';
    }
    if (title.includes('order') || url.includes('order')) {
      return 'fas fa-file-invoice';
    }
    if (title.includes('invoice') || title.includes('bill') || url.includes('invoice')) {
      return 'fas fa-file-invoice-dollar';
    }
    if (title.includes('payment') || title.includes('challan') || url.includes('payment')) {
      return 'fas fa-receipt';
    }
    if (title.includes('payroll') || title.includes('salary') || title.includes('payslip') || url.includes('payroll')) {
      return 'fas fa-money-check-alt';
    }
    if (title.includes('employee') || title.includes('staff') || url.includes('employee')) {
      return 'fas fa-id-badge';
    }
    if (title.includes('report') || url.includes('report')) {
      return 'fas fa-chart-pie';
    }
    if (title.includes('setting') || url.includes('setting') || title.includes('config')) {
      return 'fas fa-cog';
    }
    if (title.includes('create') || title.includes('add') || url.includes('create')) {
      return 'fas fa-plus-circle';
    }
    if (title.includes('list') || url.includes('list')) {
      return 'fas fa-list-ul';
    }

    if (menu?.details && menu.details.length > 0) {
      return 'fas fa-folder';
    }
    if (this.level > 0) {
      return 'fas fa-circle';
    }
    return 'fas fa-cube';
  }
}