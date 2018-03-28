import { OnDestroy, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/mergeMap';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private readonly asyncPipe: AsyncPipe;
  private subject: Subject<any> = new Subject();
  private value: Date;
  private timer: Observable<string>;
  private timezoneOffset: number = new Date().getTimezoneOffset();

  constructor(ref: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(ref);
  }

  public transform(obj: any, ...args: any[]): any {
    if (obj == null) {
      return '';
    }

    if (!(obj instanceof Date)) {
      throw new Error('TimeAgoPipe works only with Dates');
    }

    if (this.value && this.value.getTime() !== obj.getTime()) {
      this.subject.next();
      this.subject.complete();

      this.subject = new Subject();
      this.timer = this.getObservable();
    }

    this.value = obj;

    if (!this.timer) {
      this.timer = this.getObservable();
    }

    return this.asyncPipe.transform(this.timer);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  protected getObservable(): Observable<string> {
    return Observable
      .of(1)
      .repeatWhen(notifications => {
        return notifications.flatMap(() => {
          const interval = this.getUpdateInterval();

          return Observable.timer(interval);
        });
      })
      .takeUntil(this.subject)
      .map(() => this.elapsed());
  }

  private elapsed(): string {
    const delta = this.getDelta();
    const minutes = Math.round(Math.abs(delta / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));

    if (delta <= 45) {
      return 'just now';
    } else if (delta <= 90) {
      return 'a minute ago';
    } else if (minutes <= 45) {
      return `{$${minutes}} minutes ago`;
    } else if (minutes <= 90) {
      return 'an hour ago';
    } else if (hours <= 22) {
      return `{$${hours}} hours ago`;
    } else if (hours <= 36) {
      return 'yesterday';
    } else if (days <= 25) {
      return `{$${days}} days ago`;
    } else if (days <= 45) {
      return 'a month ago';
    } else if (days <= 345) {
      return `{$${months}} months ago`;
    } else if (days <= 545) {
      return 'a year ago';
    } else { // (days > 545)
      return `{$${years}} years ago`;
    }
  }

  private getDelta(): number {
    return (Date.now() - this.value.getTime()) / 1000 - (this.value.getTimezoneOffset() - this.timezoneOffset) * 60;
  }

  private getUpdateInterval(): number {
    const delta = this.getDelta();

    if (delta < 3600) { // less than 1 hour, update every 30 secs
      return 30000;
    } else { // less then a day, update every 1 hour
      return 360000;
    }
  }

}
