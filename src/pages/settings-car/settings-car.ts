import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { User } from '../../interfaces/user';

import { SettingsCarForm } from '../../forms/settings-car';

import { AppService } from '../../providers/app';
import { CarService } from '../../providers/car';

@Component({
  selector: 'page-settings-car',
  templateUrl: 'settings-car.html',
})
export class SettingsCarPage extends CustomComponent implements OnInit {
  user: User;
  form: SettingsCarForm = new SettingsCarForm();

  constructor(protected navParams: NavParams,
              protected appService: AppService,
              protected carService: CarService) {
    super();
  }

  ngOnInit(): void {
    this.user = this.navParams.get('user');

    this.hub.push(this.carService.find(this.user.id).subscribe(car => {
      if (car) {
        this.form.patchValue(car);
      }
    }));
  }

  async ionViewWillLeave(): Promise<any> {
    if (!this.form.valid || this.form.pristine) {
      return;
    }

    await this.appService.presentPleaseWait();

    try {
      const car = {
        id: this.user.id,
        ...this.form.getValues()
      };

      return await this.carService.update(car);
    }
    catch (error) {
      console.log('Update user car error');
      console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

}
