import { Component, OnInit } from '@angular/core';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Chat } from '../../interfaces/chat';

import { AuthService } from '../../providers/auth';
import { ChatService } from '../../providers/chat';

import { ArrayUtils } from '../../utils/array';

@Component({
  selector: 'conversation-list',
  templateUrl: 'conversation-list.html'
})
export class ConversationListComponent extends AbstractLoadMoreComponent<Chat> implements OnInit {
  protected uid = this.authService.currentUserUid();

  constructor(protected authService: AuthService,
              protected chatService: ChatService) {
    super(chatService.LIMIT);
  }

  ngOnInit(): void {
    this.hub.push(this.chatService.findList(this.uid).subscribe(conversations => {
      this.setEntities(conversations);
    }));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      const last = this.last();

      this.hub.push(this.chatService.findList(this.uid, last.ds).subscribe(conversations => {
        this.setEntities(conversations);

        resolve();
      }));
    });
  }

  protected normalizeList(entities: Chat[]): Chat[] {
    const list = ArrayUtils.uniqueEntities(entities);

    return ArrayUtils.sortBy(list, (chatA, chatB) => {
      return chatB.members[this.uid] - chatA.members[this.uid];
    });
  }

}
