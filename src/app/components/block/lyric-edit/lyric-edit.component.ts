import { Component, OnInit, ElementRef } from '@angular/core';
import { KEY_CODE } from '../../../consts/note-key';
import { EditorService } from '../../../services/editor.service';
import { ViewService } from '../../../services/view.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-lyric-edit',
  templateUrl: './lyric-edit.component.html',
  styleUrls: ['./lyric-edit.component.css']
})
export class LyricEditComponent implements OnInit {

  constructor(
    public editorService: EditorService,
    public elementRef: ElementRef,
    public appService: AppService,
    public viewService: ViewService
  ) { }

  ngOnInit() {
    ((this.elementRef.nativeElement as HTMLElement)
      .getElementsByClassName('lyric-input')[0] as HTMLElement).focus();
      document.documentElement.scrollTop -= 60;
  }

  public focusInput(event: FocusEvent) {
    (event.target as Element).scrollIntoView(true);
    if (this.appService.isHorizontal()) {
      document.documentElement.scrollTop -= 60;
    }
  }

  public editLyricCancel(): void {
    this.editorService.editLyricStop();
  }

  public editLyricKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === KEY_CODE.ESC || event.keyCode === KEY_CODE.TAB) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  public editLyricKeyUp(event: KeyboardEvent): void {
    if (event.keyCode === KEY_CODE.ESC) {
      this.editLyricCancel();
    } else if (event.keyCode === KEY_CODE.TAB) {
      this.editLyricCancel();
      if (event.shiftKey) {
        this.editorService.editPreviousLyric();
      } else {
        this.editorService.editNextLyric();
      }
    }
  }

}
