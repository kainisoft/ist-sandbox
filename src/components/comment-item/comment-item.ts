import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ComponentRef } from '@angular/core/src/linker/component_factory';

import { NavParams } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { CommentsListComponent } from '../comments-list/comments-list';

import { User } from '../../interfaces/user';
import { Comment } from '../../interfaces/comment';
import { Like } from '../../interfaces/like';

import { UserService } from '../../providers/user';
import { AppService } from '../../providers/app';
import { LikeService } from '../../providers/like';
import { NavigatorService } from '../../providers/navigator';

import { LikesPage } from '../../pages/likes/likes';
import { AuthService } from '../../providers/auth';

@Component({
  selector: 'comment-item',
  templateUrl: 'comment-item.html'
})
export class CommentItemComponent extends CustomComponent implements OnInit, OnDestroy {
  innerLevel: number;
  user: User;
  componentRef: ComponentRef<CommentsListComponent>;
  isHighlight = false;

  get level(): number {
    return this.innerLevel;
  }

  @Input()
  set level(level: number) {
    this.innerLevel = Math.sign(level) === 1 ? level : 0;
  }

  @Input()
  commentEntity: Comment;

  @Input()
  protected path: string[];

  protected view: ViewContainerRef;

  get replyViewContainerRef(): ViewContainerRef {
    return this.view;
  }

  @ViewChild('reply', {
    read: ViewContainerRef
  })
  set replyViewContainerRef(view: ViewContainerRef) {
    this.view = view;

    if (this.view) {
      this.loadInitReplies();
    }
  }

  constructor(protected navParams: NavParams,
              protected userService: UserService,
              protected elementRef: ElementRef,
              protected appService: AppService,
              protected likeService: LikeService,
              protected navigatorService: NavigatorService,
              protected authService: AuthService,
              @Inject(ComponentFactoryResolver) protected factoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit(): void {
    this.path = [...this.path];
    this.path.push(this.commentEntity.id);

    this.initUser();
    this.initHighlightComment();
  }

  protected initUser(): void {
    this.hub.push(this.userService.find(this.commentEntity.uid).subscribe(user => {
      this.user = user;
    }));
  }

  protected initHighlightComment(): void {
    const {comments} = this.navParams.data;

    this.isHighlight = Array.isArray(comments) && comments.includes(this.commentEntity.id);
  }

  loadInitReplies(): void {
    const {comments} = this.navParams.data;

    if (Array.isArray(comments) && comments.length) {
      const [commentId, replyId] = comments;

      if (replyId && this.commentEntity.id === commentId) {
        this.loadReplies();
      }
    }
  }

  showReplays(): void {
    if (!this.level || this.replyViewContainerRef.length) {
      this.focusInput();
    } else {
      this.loadReplies();
    }
  }

  protected focusInput(): void {
    let input;

    if (this.level) {
      input = this.elementRef.nativeElement.querySelector('form input');
    } else {
      input = this.elementRef.nativeElement.closest('comments-list');
      input = input && input.querySelector('form input');
    }

    input && input.focus();
  }

  protected loadReplies(): void {
    if (this.componentRef) {
      return;
    }

    this.replyViewContainerRef.clear();

    const factory = this.factoryResolver.resolveComponentFactory(CommentsListComponent);
    const component = this.componentRef = this.replyViewContainerRef.createComponent(factory);

    component.instance.id = this.commentEntity.id;
    component.instance.levels = this.level - 1;
    component.instance.path = this.path.slice(0, -1);
  }

  onLastReplyClick(): void {
    this.loadReplies();
  }

  openLikesPage(): Promise<any> {
    return this.navigatorService.push(LikesPage, {
      id: this.commentEntity.id
    });
  }

  async proceedLike(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      const like: Like = {
        uid: this.authService.currentUserUid(),
        parent: this.commentEntity.id,
        path: this.path
      };

      return await this.likeService.add(like);
    }
    catch (error) {
      console.error('like proceed error');
      console.dir(error);

      return null;
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.componentRef && this.componentRef.destroy();
  }

}
