import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { PaperOrientation } from '../enums/layout-alignment';
// import { EditorService } from './editor.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(public appService: AppService) {
    this.createPrintStyleElement();
  }

  public get editorElement(): HTMLElement {
    return document.getElementById('editor');
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

  public get printStyleElement(): HTMLElement {
    return document.getElementById('print-style');
  }

  public get additionalLyricElement(): HTMLElement {
    return document.getElementById('additional-lyrics');
  }

  public getPointerElement(index: number): HTMLElement {
    return document.getElementById(`block-index-${index}`);
  }

  public createPrintStyleElement(): void {
    const $head = document.getElementsByTagName('head')[0];
    const $style = document.createElement('style');
    $style.setAttribute('id', 'print-style');
    $style.appendChild(document.createTextNode(''));
    $head.appendChild($style);
  }

  public setPrintStyle(orientation: PaperOrientation): void {
    const size = orientation === PaperOrientation.Portrait ? 'portrait' : 'landscape';
    if (this.printStyleElement) {
      this.printStyleElement.innerHTML = `@media print { @page {size: ${size};}}`;
    }
  }

  public inScreen(top: number, left: number): boolean {
    if (this.appService.isVertical()) {
      const boundLeft = this.bodyElement.offsetLeft + 70;
      const boundRight = boundLeft + this.bodyElement.clientWidth - 70;
      return left > boundLeft && left < boundRight;
    } else if (this.appService.isHorizontal()) {
      const boundTop = this.bodyElement.scrollTop + 70;
      const boundBottom = boundTop + this.bodyElement.clientHeight - 250;
      return top > boundTop && top < boundBottom;
    }

    return false;
  }

  public positionInScreen(position: {top: number, left: number}): boolean {
    return this.inScreen(position.top, position.left);
  }

  public pointerInScreen(index: number): boolean {
    const element = this.getPointerElement(index);
    return element ? this.inScreen(element.offsetTop, element.offsetLeft) : false;
  }

  public scrollToPosition(position: {top: number, left: number}): void {
    if (this.appService.isHorizontal()) {
      this.bodyElement.scrollTop = position.top - 70;
    } else if (this.appService.isVertical()) {
      this.bodyElement.scrollLeft = this.bodyElement.scrollWidth;
      this.bodyElement.scrollLeft += position.left - 100;
    }
  }

  public scrollToPointer(index: number): void {
    const element = this.getPointerElement(index);
    if (!element) {
      return;
    }

    this.scrollToPosition({
      top: element.offsetTop,
      left: element.offsetLeft
    });
  }

  public getBlock(index: number): HTMLElement {
    return document.querySelector(`.editor .block[data-index="${index}"]`);
  }
}
