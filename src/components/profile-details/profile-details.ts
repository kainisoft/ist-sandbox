import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { User } from '../../interfaces/user';
import { Car } from '../../interfaces/car';

import { LocalizeService } from '../../providers/localize';
import { CarService } from '../../providers/car';

@Component({
  selector: 'profile-details',
  templateUrl: 'profile-details.html'
})
export class ProfileDetailsComponent extends CustomComponent implements OnInit {
  car: Car;
  exterior: string = '';
  interior: string = '';

  @Input()
  user: User;

  constructor(protected localizeService: LocalizeService,
              protected carService: CarService) {
    super();
  }

  ngOnInit(): void {
    this.initCar();
  }

  protected initCar(): void {
    this.hub.push(this.carService.find(this.user.id).subscribe(car => {
      if (!car) {
        return;
      }

      this.car = car;

      this.localizeService.getListText(car.exterior || []).then(list => {
        this.exterior = list.join(', ');
      });

      this.localizeService.getListText(car.interior || []).then(list => {
        this.interior = list.join(', ');
      });
    }));
  }
}
