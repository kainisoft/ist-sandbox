import { Entity } from '../core/entity';
import * as firebase from 'firebase';
import GeoPoint = firebase.firestore.GeoPoint;

export interface ServiceCenter extends Entity {
  name: string;
  desc: string;
  phone?: string;
  latLng: GeoPoint;
  uid?: string;
  address?: string;
}
