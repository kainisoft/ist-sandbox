import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Like } from '../interfaces/like';

@Injectable()
export class LikeService extends CustomFirestore<Like> {
  public readonly LIKE_PATH = 'like';
  public readonly LIMIT = 10;

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return this.LIKE_PATH;
  }

  buildPathByParentAndUid(parent: string, uid: string): string {
    return `${this.LIKE_PATH}/${parent}::${uid}`;
  }

  add(like: Like): Promise<any> {
    this.sanitizeEntity(like);
    like.createdAt = new Date();

    const path = this.buildPathByParentAndUid(like.parent, like.uid);

    return this.afs.doc(path).set(like);
  }

  findList(parent: string, startAfter: DocumentSnapshot = null): Observable<Like[]> {
    const collection: AngularFirestoreCollection<Like> = this.afs.collection(this.LIKE_PATH, ref => {
      let query: Query = ref;
      query = query.where('parent', '==', parent);
      query = query.orderBy('createdAt');

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      return query.limit(this.LIMIT);
    });

    return this.getEntities(collection);
  }

}
