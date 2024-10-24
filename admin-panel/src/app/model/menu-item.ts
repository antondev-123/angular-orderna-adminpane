import { Role } from '@orderna/admin-panel/src/app/model/enum/role';

export class MenuItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  children: MenuItem[];
  badge?: string;
  constructor({
    id = 0,
    name = '',
    path = '',
    icon = '',
    children = [],
    badge = '',
  }: Partial<MenuItem> = {}) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.icon = icon;
    this.children = children;
    this.badge = badge;
  }
}
