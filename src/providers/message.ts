import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Message } from '../interfaces/message';

import { ChatService } from './chat';

@Injectable()
export class MessageService extends CustomFirestore<Message> {
  protected MESSAGE_PATH = 'message';

  constructor(protected afs: AngularFirestore,
              protected chatService: ChatService) {
    super(afs);
  }

  get collectionName(): string {
    return this.MESSAGE_PATH;
  }

  buildPath(id: string): string {
    return `${this.chatService.buildPath(id)}/${this.collectionName}`;
  }

  findList(chatId: string, limit: number = this.LIMIT, startAfter: DocumentSnapshot = null): Observable<Message[]> {
    const path = this.buildPath(chatId);
    const collection: AngularFirestoreCollection<Message> = this.afs.collection(path, ref => {
      let query: Query = ref;
      query = query.where('parent', '==', chatId);
      query = query.orderBy('createdAt', 'desc');

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      return query.limit(limit);
    });

    return this.getEntities(collection);
  }

  findByChatIdAndMessageId(chatId: string, id: string): Observable<Message> {
    const path = `${this.buildPath(chatId)}/${id}`;
    const doc: AngularFirestoreDocument<Message> = this.afs.doc(path);

    return this.getEntity(doc);
  }

  async add(message: Message): Promise<Message> {
    const path = this.buildPath(message.parent);

    this.sanitizeEntity(message);
    message.createdAt = new Date();

    const doc = await this.afs.collection(path).add(message);
    const snapshot = await doc.get();

    return this.convertData(snapshot);
  }

}
