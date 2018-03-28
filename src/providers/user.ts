import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { CustomFirestore } from '../core/firestore';

import { PresenceStatus, User } from '../interfaces/user';

import { AuthService } from './auth';

@Injectable()
export class UserService extends CustomFirestore<User> {
  private readonly USERS_PATH = 'user';

  constructor(protected afs: AngularFirestore,
              protected authService: AuthService) {
    super(afs);
  }

  get collectionName(): string {
    return this.USERS_PATH;
  }

  find(uid: string = this.authService.currentUserUid()): Observable<User> {
    return super.find(uid);
  }

  // setLang(lang: string, uid: string = this.authService.currentUserUid()): Promise<any> {
  //   const path = this.buildPath(uid);
  //
  //   return this.afs.doc(path).set({lang}, {merge: true});
  // }

  setPresence(presence: PresenceStatus, uid: string = this.authService.currentUserUid()): Promise<any> {
    const path = this.buildPath(uid);

    return this.afs.doc(path).set({presence}, {merge: true});
  }

  setAvatar(avatarUrl: string, uid: string = this.authService.currentUserUid()): Promise<void> {
    const path = this.buildPath(uid);

    return this.afs.doc(path).set({profile: {avatar: avatarUrl}}, {merge: true});
  }

  // setAvatarThumbnail(avatarThumbnail: string, uid: string = this.authService.currentUserUid()): Promise<void> {
  //   const path = this.buildPath(uid);
  //
  //   return this.afs.doc(path).set({profile: {avatarThumbnail}}, {merge: true});
  // }

  setCover(coverUrl: string, uid: string = this.authService.currentUserUid()): Promise<any> {
    const path = this.buildPath(uid);

    return this.afs.doc(path).set({profile: {cover: coverUrl}}, {merge: true});
  }

  setNotifyToken(token: string, uid: string = this.authService.currentUserUid()): Promise<any> {
    const path = this.buildPath(uid);

    return this.afs.doc(path).set({notifyToken: token}, {merge: true});
  }
}
