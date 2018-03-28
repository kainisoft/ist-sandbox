import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Feed } from '../interfaces/feed';

import { AuthService } from './auth';

@Injectable()
export class FeedService extends CustomFirestore<Feed> {
  protected readonly FEED_PATH = 'feed';

  constructor(protected afs: AngularFirestore,
              protected authService: AuthService) {
    super(afs);
  }

  get collectionName(): string {
    return this.FEED_PATH;
  }

  findList(startAfter: DocumentSnapshot = null): Observable<Feed[]> {
    const collection: AngularFirestoreCollection<Feed> =
      this.afs.collection(this.FEED_PATH, ref => {
        let query: Query = ref;

        query = query.orderBy('createdAt', 'desc');

        if (startAfter) {
          query = query.startAfter(startAfter);
        }

        return query.limit(this.LIMIT);
      });

    return this.getEntities(collection);
  }

}
