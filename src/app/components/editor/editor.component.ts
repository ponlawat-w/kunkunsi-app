import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Block } from '../../classes/block';
import { Note } from '../../classes/note';
import { EditorService } from '../../services/editor.service';
import { AppService } from '../../services/app.service';
import { ViewService } from '../../services/view.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public focus: boolean;

  constructor(
    public elementRef: ElementRef,
    public appService: AppService,
    public editorService: EditorService,
    public viewService: ViewService
  ) { }

  ngOnInit() {
  }

  public get noPointer(): boolean {
    return this.editorService.project.isSingleDiminutive(this.editorService.correspondPointer)
      || this.editorService.project.isMark(this.editorService.pointer)
      || (this.appService.isHorizontal()
        && this.editorService.project.isLineBreak(this.editorService.pointer)
        && this.editorService.project.isMark(this.editorService.correspondPointer));
  }

  public get pointerPosition(): {top: number, left: number} {
    let top = 0;
    let left = 0;

    let index = this.editorService.pointer >= this.editorService.blocks.length ?
      this.editorService.blocks.length - 1 : this.editorService.pointer;

    const $hostElement = this.elementRef.nativeElement as Element;

    let pointAtBlockEnd = false;
    let $block = $hostElement.querySelector(`div[data-index="${index}"]`) as HTMLElement;
    if ($block && $block.classList.contains('block-newline') && !this.editorService.project.isEmptyLine(index)) {
      index--;
      $block = $hostElement.querySelector(`div[data-index="${index}"]`);
      pointAtBlockEnd = true;
    }
    if ($block) {
      if (this.editorService.pointer === this.editorService.blocks.length
        && !this.editorService.project.isLineBreak(index)) {
        pointAtBlockEnd = true;
      }
      if (this.editorService.project.isLineBreak(this.editorService.pointer)
        && this.editorService.project.isMark(this.editorService.pointer - 1)) {
        pointAtBlockEnd = false;
      }

      if (this.appService.isVertical()) {
        const bounding = $block.getBoundingClientRect();
        top = bounding.top;
        left = bounding.left;
        if (pointAtBlockEnd) {
          top += this.editorService.project.isMultiDiminutive(index) ? 40 : 80;
        }
      } else if (this.appService.isHorizontal()) {
        top = $block.offsetTop;
        left = $block.offsetLeft;
        if (pointAtBlockEnd) {
          left += this.editorService.project.isMultiDiminutive(index) ? 40 : 80;
        }
      }
    } else {
      const hostBounding = $hostElement.getBoundingClientRect();
      top = hostBounding.top;
      left = hostBounding.left;
    }

    return {
      top: top,
      left: left
    };
  }

  public get pointerPositionCss(): {top: string, left: string} {
    const pos = this.pointerPosition;
    return {
      top: `${pos.top}px`,
      left: `${pos.left}px`
    };
  }

  public editorClick(event: MouseEvent) {
    if ((event.target as Element).classList.contains('editor')) {
      this.editorService.pointer = this.editorService.project.blocks.length;
    }
  }

  public onfocus(): void {
    this.focus = true;
  }

  public onblur(): void {
    this.focus = false;
  }

  public keydown(event: KeyboardEvent): void {
    this.editorService.onkeydown(event);
  }

  public keyup(event: KeyboardEvent): void {
    if (this.editorService.onkeyup(event) && !this.viewService.pointerInScreen()) {
      this.viewService.scrollToPointer();
    }
  }

}
