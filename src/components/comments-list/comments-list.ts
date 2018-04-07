import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { CommentForm } from '../../forms/comment';

import { User } from '../../interfaces/user';
import { Comment } from '../../interfaces/comment';

import { UserService } from '../../providers/user';
import { CommentService } from '../../providers/comment';

import { ArrayUtils } from '../../utils/array';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'comments-list',
  templateUrl: 'comments-list.html'
})
export class CommentsListComponent extends CustomComponent implements OnInit {
  protected myAddedComments: Comment[] = [];
  protected isReply: boolean = false;

  comments: Comment[];
  user: User;
  form: CommentForm = new CommentForm();
  loadState: LoadState = LoadState.NO_MORE;
  loadStates = LoadState;

  @Input()
  id: string;

  @Input()
  levels: number;

  @Input()
  path: string[] = [];

  constructor(protected userService: UserService,
              protected commentService: CommentService,
              protected navParams: NavParams) {
    super();
  }

  ngOnInit(): void {
    this.path = [...this.path];
    this.path.push(this.id);

    this.isReply = this.path.length > 1;

    this.initUser();
    this.initForm();
    this.initComments();
  }

  protected initUser(): void {
    this.hub.push(this.userService.find().subscribe(user => {
      this.user = user;
    }));
  }

  protected initComments(): void { // TODO refactor
    const {comments} = this.navParams.data;

    if (Array.isArray(comments) && comments.length) {
      let commentId;

      if (this.isReply && comments.length >= 2) { // TODO definitely refactor
        [, commentId] = comments;
      } else {
        [commentId] = comments;
      }

      this.commentService.find(commentId).take(1).toPromise()
        .then(comment => {
          this.hub.push(this.commentService.findListStartAt(this.id, comment.ds).subscribe(comments => {
            this.comments = this.normalizeComments(comments);

            this.setIsMoreAwaiting(this.comments);
          }));
        });
    } else {
      this.hub.push(this.commentService.findList(this.id).subscribe(comments => {
        this.comments = this.normalizeComments(comments);

        this.setIsMoreAwaiting(this.comments);
      }));
    }
  }

  protected initForm(): void {
    if (this.isReply) {
      this.form.getTextElement().setPlaceHolder('Write a reply...');
    }
  }

  async addComment(): Promise<any> {
    const commentText = this.form.getTextElement().getValue();

    if (!commentText || !commentText.trim()) {
      return;
    }

    this.form.reset();

    const newComment = await this.commentService.add({
      uid: this.user.id,
      parent: this.id,
      path: this.path,
      text: commentText
    });

    this.myAddedComments.push(newComment);

    this.comments = this.normalizeComments(this.comments);
  }

  async loadMore(): Promise<any> {
    this.beforeLoadMore();

    const lastComment = this.getLastComment();
    this.hub.push(this.commentService.findList(this.id, lastComment.ds).subscribe(comments => {
      this.comments = this.normalizeComments([...comments, ...this.comments]);
      this.setIsMoreAwaiting(comments);
    }));
  }

  protected normalizeComments(comments: Comment[]): Comment[] {
    if (this.myAddedComments.length) {
      const myAddedComments = this.myAddedComments.filter(myComment => {
        return !comments.some(comment => comment.id === myComment.id);
      });

      if (myAddedComments.length) {
        comments = [...comments, ...myAddedComments];
      }
    }

    if (this.comments) {
      comments = [...comments, ...this.comments];
    }

    return ArrayUtils.sortByCreatedAt(
      ArrayUtils.uniqueEntities(comments)
    ).reverse();
  }

  protected getLastComment(): Comment {
    if (this.myAddedComments.length) {
      const originalComments = this.comments.filter(comment => {
        return !this.myAddedComments.some(myComment => comment.id === myComment.id);
      });

      if (originalComments.length) {
        return originalComments.slice(-1).pop();
      }
    }

    return this.comments.slice(-1).pop();
  }

  protected beforeLoadMore(): void {
    this.loadState = LoadState.LOADING;
  }

  protected setIsMoreAwaiting(comments: Comment[]): void {
    if (comments.length && comments.length % this.commentService.LIMIT === 0) {
      this.loadState = LoadState.WAIT;
    } else {
      this.loadState = LoadState.NO_MORE;
    }
  }

  trackByFn(index: number, comment: Comment): string {
    return comment.id;
  }

}

export enum LoadState {
  WAIT,
  LOADING,
  NO_MORE
}
