import { Injectable } from '@angular/core';

import { CustomFirestore } from '../core/firestore';

import { Car } from '../interfaces/car';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class CarService extends CustomFirestore <Car> {

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return 'car';
  }

}
