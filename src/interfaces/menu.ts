import { Page } from 'ionic-angular/navigation/nav-util';

export interface Menu {
  title: string;
  icon: string;
  page: Page | string;
  class?: string;
  notice?: number;
}
