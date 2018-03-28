import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Comment } from '../interfaces/comment';

@Injectable()
export class CommentService extends CustomFirestore<Comment> {
  public readonly LIMIT = 10;
  public readonly COMMENT_PATH = 'comment';

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return this.COMMENT_PATH;
  }

  findList(parent: string, startAfter: DocumentSnapshot = null): Observable<Comment[]> {
    const collection: AngularFirestoreCollection<Comment> = this.afs.collection(this.COMMENT_PATH, ref => {
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

  async add(comment: Comment): Promise<Comment> {
    this.sanitizeEntity(comment);
    comment.createdAt = new Date();

    const doc = await this.afs.collection(this.COMMENT_PATH).add(comment);
    const snapshot = await doc.get();

    return this.convertData(snapshot);
  }

}
