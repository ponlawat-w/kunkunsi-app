import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(public appService: AppService) {
  }

  public get bodyElement(): HTMLElement {
    if (this.appService.isHorizontal()) {
      return document.documentElement;
    } else if (this.appService.isVertical()) {
      return this.bodyDiv;
    }
  }

  public get bodyDiv(): HTMLElement {
    return document.getElementById('body');
  }

  public get pointerElement(): HTMLElement {
    return document.getElementById('pointer');
  }

  public inScreen(top: number, left: number): boolean {
    if (this.appService.isVertical()) {
      const boundLeft = this.bodyElement.offsetLeft + 70;
      const boundRight = boundLeft + this.bodyElement.clientWidth - 70;
      return left > boundLeft && left < boundRight;
    } else if (this.appService.isHorizontal()) {
      const boundTop = this.bodyElement.scrollTop + 70;
      const boundBottom = boundTop + this.bodyElement.clientHeight - 250;
      console.log(`${boundTop} ${top} ${boundBottom}`);
      return top > boundTop && top < boundBottom;
    }

    return false;
  }

  public positionInScreen(position: {top: number, left: number}): boolean {
    return this.inScreen(position.top, position.left);
  }

  public pointerInScreen(): boolean {
    return this.pointerElement ? this.inScreen(this.pointerElement.offsetTop, this.pointerElement.offsetLeft) : false;
  }

  public scrollToPosition(position: {top: number, left: number}): void {
    if (this.appService.isHorizontal()) {
      this.bodyElement.scrollTop = position.top - 70;
    } else if (this.appService.isVertical()) {
      this.bodyElement.scrollLeft = position.left - 70;
    }
  }

  public scrollToPointer(): void {
    if (!this.pointerElement) {
      return;
    }

    this.scrollToPosition({
      top: this.pointerElement.offsetTop,
      left: this.pointerElement.offsetLeft
    });
  }
}
