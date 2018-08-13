import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../../classes/block';
import { AppService } from '../../services/app.service';
import { EditorService } from '../../services/editor.service';
import { Note } from '../../classes/note';
import { NoteSymbol } from '../../classes/note-symbol';

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
    public editorService: EditorService
  ) { }

  ngOnInit() {
  }

  public get blockClass() {
    const classes = this.object.classes;

    if (this.appService.isVertical()) {
      classes.push('vertical');
    } else if (this.appService.isHorizontal()) {
      classes.push('horizontal');
    }

    if (this.object.kunkunsi instanceof Note) {
      // Type Note
      if (this.editorService.project.isLineBreak(this.index - 1)) {
        classes.push('block-first');
      }
      if (this.editorService.project.isLineBreak(this.index + 1)) {
        classes.push('block-last');
      }

      if (this.editorService.project.isDiminutive(this.index)) {
        classes.push('diminutive');
        if (this.editorService.project.isSingleDiminutive(this.index)) {
          classes.push('diminutive-single');
          if (this.editorService.pointer === this.index) {
            classes.push('diminutive-single-pointed');
          }
        } else {
          classes.push('diminutive-multi');
        }
      } else {
        if (this.editorService.project.isSingleDiminutive(this.index + 1, true)) {
          classes.push('next-single-dim');
        }
        if (this.editorService.project.isSingleDiminutive(this.index - 1, true)) {
          classes.push('prev-single-dim');
        }
      }
    } else if (this.object.kunkunsi instanceof NoteSymbol) {
      // Type NoteSymbol
      if (this.editorService.project.isEmptyLine(this.index)) {
        classes.push('empty-line');
      }
    }

    return classes.join(' ');
  }

}
