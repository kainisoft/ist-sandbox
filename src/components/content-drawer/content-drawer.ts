import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { AfterViewInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { DomController, Platform } from 'ionic-angular';
import { DIRECTION_VERTICAL } from 'ionic-angular/gestures/hammer';

@Component({
  selector: 'content-drawer',
  templateUrl: 'content-drawer.html'
})
export class ContentDrawerComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  protected hammer: any;

  @Input('options') options: ContentDrawerOptions;

  protected defaultOptions: ContentDrawerOptions = {
    slider: 'slider',
    handleHeight: 42, // TODO calc height
    bounceBack: true,
    thresholdTop: 100,
    thresholdBottom: 100
  };

  constructor(public element: ElementRef,
              public renderer: Renderer2,
              public domCtrl: DomController,
              public platform: Platform) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options.firstChange) {
      return;
    }

    this.setInitHeight();
  }

  ngOnInit(): void {
    this.mergeOptions();
    this.setInitHeight();
  }

  protected mergeOptions(): void {
    this.options = {...this.defaultOptions, ...this.options};
  }

  ngAfterViewInit(): void {
    const nativeElement = this.element.nativeElement;

    const element = nativeElement.querySelector(this.options.slider);
    const hammer = this.hammer = new window['Hammer'](element || nativeElement);

    hammer.get('pan').set({direction: DIRECTION_VERTICAL});
    hammer.on('pan', event => this.handlePan(event));
  }

  protected setInitHeight(): void {
    const { handleHeight, initHeight } = this.options;
    const { nativeElement } = this.element;
    let height = this.platform.height();

    if (initHeight && initHeight > handleHeight) {
      height -= initHeight;
    } else {
      height -= handleHeight;
    }

    const {top: currentTop} = this.element.nativeElement.getBoundingClientRect();

    if (currentTop !== height) {
      this.renderer.setStyle(nativeElement, 'transition', 'top 0.5s');
      this.renderer.setStyle(nativeElement, 'top', height + 'px');
    }
  }

  handlePan(ev: any): void {
    const options = this.options;
    const newTop = ev.center.y;
    let bounceToBottom = false;
    let bounceToTop = false;

    if (options.bounceBack && ev.isFinal) {
      const topDiff = newTop - options.thresholdTop;
      const bottomDiff = (this.platform.height() - options.thresholdBottom) - newTop;

      topDiff >= bottomDiff ? bounceToBottom = true : bounceToTop = true;
    }

    if ((newTop < options.thresholdTop && ev.additionalEvent === 'panup') || bounceToTop) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', 'top 0.5s');
        this.renderer.setStyle(this.element.nativeElement, 'top', '56px'); // TODO calc top
      });
    } else if (((this.platform.height() - newTop) < options.thresholdBottom && ev.additionalEvent === 'pandown') || bounceToBottom) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', 'top 0.5s');
        this.renderer.setStyle(this.element.nativeElement, 'top', this.platform.height() - options.handleHeight + 'px');
      });
    } else {
      this.renderer.setStyle(this.element.nativeElement, 'transition', 'none');

      if (newTop > 0 && newTop < (this.platform.height() - options.handleHeight)) {
        if (ev.additionalEvent === 'panup' || ev.additionalEvent === 'pandown') {
          this.domCtrl.write(() => {
            this.renderer.setStyle(this.element.nativeElement, 'top', newTop + 'px');
          });
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.hammer && this.hammer.destroy();
  }

}

export interface ContentDrawerOptions {
  slider: string;
  handleHeight?: number;
  bounceBack?: boolean;
  thresholdTop?: number;
  thresholdBottom?: number;
  initHeight?: number;
}
