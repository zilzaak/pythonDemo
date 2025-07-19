import { SubMenuItem } from "./subMenuItem";

export interface MenuItem {
  id:string;  //menu id
  frontUrl:string;  
  menu:string;  //menu name
  apiPattern:string;  // backend api which will be used in html page to initiated data
  methodName:string; // backend api method , like post , put , get , patch etc 
  parentId:number;   // parent menu id 
  details:MenuItem[]; // cheild menu list under current menu
  }
  