import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Chat, ChatTypes } from '../interfaces/chat';

@Injectable()
export class ChatService extends CustomFirestore<Chat> {
  protected CHAT_PATH = 'chat';

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return this.CHAT_PATH;
  }

  findList(userId: string, startAfter: DocumentSnapshot = null): Observable<Chat[]> {
    const collection: AngularFirestoreCollection<Chat> = this.afs.collection(this.collectionName, ref => {
      let query: Query = ref;
      query = query.where(`members.${userId}`, '>', 0);
      query = query.orderBy(`members.${userId}`, 'desc');

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      return query.limit(this.LIMIT);
    });

    return this.getEntities(collection);
  }

  findP2P(userA: string, userB: string): Promise<Chat> {
    const collection: AngularFirestoreCollection<Chat> = this.afs.collection(this.collectionName, query => {
      return query.where(`opponents.${userA}`, '==', userB)
        .where(`opponents.${userB}`, '==', userA)
        .where('type', '==', ChatTypes.P2P)
        .limit(1);
    });

    return this.getEntities(collection).take(1).toPromise().then(docs => {
      return [...docs].pop();
    });
  }

  openChat(userA: string, userB: string): Promise<Chat> {
    const chat: Chat = {
      members: {
        [userA]: 0,
        [userB]: 0,
      },
      opponents: {
        [userA]: userB,
        [userB]: userA
      },
      counter: {
        [userA]: 0,
        [userB]: 0
      },
      delivered: {
        [userA]: true,
        [userB]: true
      },
      type: ChatTypes.P2P
    };

    return this.add(chat);
  }

  markAsDelivered(chat: Chat, toUser: string): Promise<Chat> {
    if (chat.delivered[toUser]) {
      return Promise.resolve(chat);
    }

    chat.delivered[toUser] = true;

    return this.update(chat);
  }

  markAsRead(chat: Chat, toUser: string): Promise<Chat> {
    if (!chat.counter[toUser]) {
      return Promise.resolve(chat);
    }

    chat.counter[toUser] = 0;

    return this.update(chat);
  }

}
