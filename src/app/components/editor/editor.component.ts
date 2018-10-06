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

  public editorClick(event: MouseEvent) {
    const $target: Element = event.target as Element;
    if ($target.classList.contains('editor')) {
      this.editorService.pointer = this.editorService.project.blocks.length;
    }
  }

  public onfocus(): void {
    this.editorService.focus = true;
  }

  public onblur(): void {
    this.editorService.focus = false;
  }

  public keydown(event: KeyboardEvent): void {
    this.editorService.onkeydown(event);
  }

  public keyup(event: KeyboardEvent): void {
    if (this.editorService.onkeyup(event)) {
      this.viewService.scrollToPointer(this.editorService.pointer - 1);
    }
  }

}
