import { NavParams } from 'ionic-angular';

import { CustomComponent } from './component';

export class CustomPage extends CustomComponent {
  title: string = this.navParams.get('title');

  constructor(protected navParams: NavParams) {
    super();
  }

}
