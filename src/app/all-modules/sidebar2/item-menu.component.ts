import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'src/app/login-module/models/menuItem';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.css']
})
export class ItemMenuComponent{

  @Input() menu!: MenuItem;
  @Input() level: number = 0;
  expandedMenus: { [id: string]: boolean } = {};



  checkUrl(menu:MenuItem):boolean{
    let  fruits = ['create', 'update','delete','get','edit'];
  if(menu.apiPattern==null){
   return true;
  }
  let strArr=menu.apiPattern.toString().split("/");
  let lastPart=strArr[strArr.length-1];
  if(fruits.includes(lastPart)){
    return false;
  }
   return true;
  }


  toggleMenu(menuId: string): void {
    this.expandedMenus[menuId] = !this.expandedMenus[menuId];
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus[menuId];
  }
}