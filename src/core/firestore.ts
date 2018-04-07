import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { Entity } from './entity';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable()
export abstract class CustomFirestore<T extends Entity> {
  public LIMIT = 10;

  protected constructor(protected afs: AngularFirestore) { }

  protected sanitizeEntity(entity: T): T {
    delete entity.id;
    delete entity.ds;

    Object.keys(entity).forEach(key => {
      if (entity[key] === undefined) {
        delete entity[key];
      }
    });

    return entity;
  }

  abstract get collectionName(): string;

  buildPath(id: string): string {
    return `${this.collectionName}/${id}`;
  }

  find(id: string): Observable<T> {
    const path = this.buildPath(id);
    const doc: AngularFirestoreDocument<T> = this.afs.doc(path);

    return this.getEntity(doc);
  }

  async save(entity: T): Promise<T> {
    if (!!entity.id) {
      return await this.update(entity);
    } else {
      return await this.add(entity);
    }
  }

  async add(entity: T): Promise<T> {
    this.sanitizeEntity(entity);
    entity.createdAt = new Date();

    const doc = await this.afs.collection(this.collectionName).add(entity);
    const snapshot = await doc.get();

    return this.convertData(snapshot);
  }

  async update(entity: T): Promise<T> {
    const clone = Object.assign({}, entity);
    const path = this.buildPath(clone.id);

    this.sanitizeEntity(clone);

    await this.afs.doc(path).set(clone, {merge: true});

    return Promise.resolve(entity);
  }

  delete(id: string): Promise<any> {
    const path = this.buildPath(id);

    return this.afs.doc(path).delete();
  }

  getEntities(ref: AngularFirestoreCollection<T>): Observable<T[]> {
    return ref.snapshotChanges().map((actions: DocumentChangeAction[]) => {
      return actions.map((action: DocumentChangeAction) => {
        return this.convertData(action.payload.doc);
      });
    });
  }

  getEntity(ref: AngularFirestoreDocument<T>): Observable<T> {
    return ref.snapshotChanges().map(action => {
      return this.convertData(action.payload);
    });
  }

  protected convertData(documentSnapshot: DocumentSnapshot): T {
    const { id, exists } = documentSnapshot;

    if (!exists) {
      return null;
    }

    const data = documentSnapshot.data() as T;
    const entity: Entity = {
      id,
      ds: documentSnapshot
    };

    return Object.assign({}, entity, data); // TODO use spread. For now getting this "Spread types may only be created from object types"
  }

}
