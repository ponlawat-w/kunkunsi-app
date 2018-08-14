import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../../classes/block';
import { AppService } from '../../services/app.service';
import { EditorService } from '../../services/editor.service';
import { Note } from '../../classes/note';
import { NoteSymbol } from '../../classes/note-symbol';
import { SpecialNote } from '../../enums/note';
import { ViewService } from '../../services/view.service';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: [
    './block.component.css',
    './block-vertical.component.css',
    './block-horizontal.component.css'
  ]
})
export class BlockComponent implements OnInit {

  @Input() object: Block;
  @Input() index: number;

  constructor(
    public appService: AppService,
    public editorService: EditorService,
    public viewService: ViewService
  ) { }

  ngOnInit() {
  }

  public get lyricBeingEdited(): boolean {
    return this.index === this.editorService.lyricEditIndex;
  }

  public get markSrc(): string {
    if (this.object.kunkunsi instanceof NoteSymbol) {
      switch (this.object.kunkunsi.value) {
        case SpecialNote.ArrowRepeatBegin:
          return 'assets/marks/arrow-begin.jpg';
        case SpecialNote.ArrowRepeatEnd:
          return 'assets/marks/arrow-end.jpg';
        case SpecialNote.CircleRepeatBegin:
          return 'assets/marks/circle-begin.jpg';
        case SpecialNote.CircleRepeatEnd:
          return 'assets/marks/circle-end.jpg';
      }
    }
    return null;
  }

  public get blockClass(): string {
    const classes = this.object.classes;

    if (this.appService.isVertical()) {
      classes.push('vertical');
    } else if (this.appService.isHorizontal()) {
      classes.push('horizontal');
    }

    if (this.object.kunkunsi instanceof Note) {
      // Type Note
      if (this.isFirst()) {
        classes.push('block-first');
      }
      if (this.isLast()) {
        classes.push('block-last');
      }

      if (this.editorService.project.isDiminutive(this.index)) {
        classes.push('diminutive');
        if (this.editorService.project.isSingleDiminutive(this.index)) {
          classes.push('diminutive-single');
          if (this.editorService.focus && this.editorService.pointer === this.index) {
            classes.push('diminutive-single-pointed');
          }
        } else {
          classes.push('diminutive-multi');
        }
      } else {
        if (this.editorService.project.isSingleDiminutive(this.index + 1)) {
          classes.push('next-single-dim');
        }
        if (this.editorService.project.isSingleDiminutive(this.index - 1)) {
          classes.push('prev-single-dim');
        }
      }
    } else if (this.object.kunkunsi instanceof NoteSymbol) {
      // Type NoteSymbol
      if (this.editorService.project.isEmptyLine(this.index)) {
        classes.push('empty-line');
      } else if (this.editorService.project.isMark(this.index)) {
        if (this.editorService.focus && this.editorService.pointer === this.index) {
          classes.push('mark-pointed');
        }
        if (this.editorService.project.isEmptyLineTrimmed(this.index)) {
          classes.push('mark-empty');
        }
      }
    }

    return classes.join(' ');
  }

  public isFirst(): boolean {
    if (this.editorService.project.isLineBreak(this.index - 1)) {
      return true;
    }

    return this.editorService.project.isMark(this.index - 1)
      && this.editorService.project.isLineBreak(this.index - 2);
  }

  public isLast(): boolean {
    if (this.editorService.project.isLineBreak(this.index + 1)) {
      return true;
    }

    return this.editorService.project.isMark(this.index + 1)
      && this.editorService.project.isLineBreak(this.index + 2);
  }

  public editLyric(): void {
    if (!this.appService.printing) {
      this.editorService.editLyricStart(this.index);
    }
  }

}
