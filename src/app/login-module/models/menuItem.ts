import { SubMenuItem } from "./subMenuItem";

export interface MenuItem {
  title: string;
  roles: string[];
  collapsed: boolean;
  submenus: { title: string; frontUrl: string }[];
  }
  