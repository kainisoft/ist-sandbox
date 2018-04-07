import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import Query = firebase.firestore.Query;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

import { CustomFirestore } from '../core/firestore';

import { Notification } from '../interfaces/notification';

@Injectable()
export class NotificationService extends CustomFirestore<Notification> {

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return 'notification';
  }

  findList(uid: string, startAfter: DocumentSnapshot = null): Observable<Notification[]> {
    const collection: AngularFirestoreCollection<Notification> = this.afs.collection(this.collectionName, ref => {
      let query: Query = ref;

      query = query
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc');

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      return query.limit(this.LIMIT);
    });

    return this.getEntities(collection);
  }

  markAsRead(notification: Notification): Promise<any> {
    if (notification.isRead) {
      return Promise.resolve(notification);
    }

    const path = this.buildPath(notification.id);

    return this.afs.doc(path).set({isRead: true}, {merge: true});
  }
}
