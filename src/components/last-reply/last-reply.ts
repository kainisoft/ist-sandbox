import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { User } from '../../interfaces/user';
import { Comment } from '../../interfaces/comment';

import { UserService } from '../../providers/user';

@Component({
  selector: 'last-reply',
  templateUrl: 'last-reply.html'
})
export class LastReplyComponent extends CustomComponent implements OnInit {
  user: User;

  @Input()
  commentEntity: Comment;

  @Output()
  protected click = new EventEmitter();

  constructor(protected userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find(this.commentEntity.lastReply).subscribe(user => {
      this.user = user;
    }));
  }

  onClick(): void {
    this.click.emit(this.commentEntity);
  }

}
