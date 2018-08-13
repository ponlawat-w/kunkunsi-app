import { Injectable } from '@angular/core';
import { Project } from '../classes/project';
import { Block } from '../classes/block';
import { NOTE_KEY, KEY_CODE } from '../consts/note-key';
import { Note } from '../classes/note';
import { SpecialNote, GeneralNote, NoteMark } from '../enums/note';
import { AppService } from './app.service';
import { NoteSymbol } from '../classes/note-symbol';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  public project: Project;
  private _pointer: number;

  private keyMap: object;

  constructor(public appService: AppService) {
    this.project = new Project();
    this._pointer = 0;
    this.keyMap = NOTE_KEY.QWERTY;
  }

  get title(): string {
    return this.project.title ? this.project.title : 'タイトル無し';
  }

  set title(newtitle: string) {
    this.project.title = newtitle.trim();
  }

  get blocks(): Block[] {
    return this.project.blocks;
  }

  get pointer(): number {
    return this._pointer;
  }

  get correspondPointer(): number {
    if (this.pointer >= this.project.blocks.length) {
      return this.project.blocks.length - 1;
    }
    if (this.pointer < 0) {
      return 0;
    }

    return this.pointer;
  }

  set pointer(position: number) {
    if (position < 0) {
      this._pointer = 0;
      return;
    }

    if (position > this.project.blocks.length) {
      this._pointer = this.project.blocks.length;
      return;
    }

    this._pointer = position;
  }

  private pointerToPreviousLine(): void {
    this.pointer = this.project.previousLineBreakIndexFrom(this.pointer);
    this.pointer = this.project.previousLineBreakIndexFrom(this.pointer);
    if (this.pointer > 0) {
      this.pointer++;
    }
  }

  private pointerToNextLine(): void {
    this.pointer = this.project.nextLineBreakIndexFrom(this.pointer) + 1;
  }

  public onkeydown(event: KeyboardEvent): void {
    if ((!this.keyMap[event.key] && !KEY_CODE[event.keyCode]) || event.shiftKey || event.altKey) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public onkeyup(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();
    if (typeof this.keyMap[key] !== 'undefined') {
      let note = this.keyMap[key];
      if (event.shiftKey) {
        note |= NoteMark.Touch;
      } else if (event.altKey) {
        note |= NoteMark.Swing;
      }
      this.project.insertNote(new Note(note), this.pointer);
      this.pointer++;
      return true;
    } else if (event.key === '1') {
      if (this.project.validIndex(this.correspondPointer)) {
        this.project.blocks[this.correspondPointer].toggleDiminutive();
      }
      return true;
    }

    if (event.keyCode === KEY_CODE.SPACEBAR) {
      this.project.insertNote(new Note(GeneralNote.Space), this.pointer);
      this.pointer++;
      return true;
    }

    if (event.keyCode === KEY_CODE.ENTER) {
      this.project.insertSymbol(new NoteSymbol(SpecialNote.NewLine), this.pointer);
      this.pointer++;
      return true;
    }

    if (event.keyCode === KEY_CODE.BACKSPACE) {
      if (event.ctrlKey) {
        let wordBreak = this.project.previousWordBreakIndexFrom(this.pointer) + 1;
        wordBreak = wordBreak === this.pointer ? wordBreak - 1 : wordBreak;
        this.project.deleteSpan(wordBreak, this.pointer);
        this.pointer = wordBreak;
        return true;
      }
      this.project.deleteOne(--this.pointer);
      return true;
    }

    if (event.keyCode === KEY_CODE.DELETE) {
      if (event.ctrlKey) {
        const wordBreak = this.project.nextWordBreakIndexFrom(this.pointer);
        this.project.deleteSpan(this.pointer, wordBreak);
        return true;
      }
      this.project.deleteOne(this.pointer);
      return true;
    }

    if (event.keyCode === KEY_CODE.HOME) {
      this.pointer = this.project.previousLineBreakIndexFrom(this.pointer);
      if (this.pointer > 0) {
        this.pointer++;
      }
      return true;
    }

    if (event.keyCode === KEY_CODE.END) {
      this.pointer = this.project.nextLineBreakIndexFrom(this.pointer);
      return true;
    }

    if (this.appService.isVertical()) {
      if (event.keyCode === KEY_CODE.UP) {
        this.pointer = event.ctrlKey ? this.project.previousWordBreakIndexFrom(this.pointer) : this.pointer - 1;
        return true;
      }
      if (event.keyCode === KEY_CODE.DOWN) {
        this.pointer = event.ctrlKey ? this.project.nextWordBreakIndexFrom(this.pointer) : this.pointer + 1;
        return true;
      }
      if (event.keyCode === KEY_CODE.LEFT) {
        this.pointerToNextLine();
        return true;
      }
      if (event.keyCode === KEY_CODE.RIGHT) {
        this.pointerToPreviousLine();
        return true;
      }
    } else if (this.appService.isHorizontal()) {
      if (event.keyCode === KEY_CODE.LEFT) {
        this.pointer = event.ctrlKey ? this.project.previousWordBreakIndexFrom(this.pointer) : this.pointer - 1;
        return true;
      }
      if (event.keyCode === KEY_CODE.RIGHT) {
        this.pointer = event.ctrlKey ? this.project.nextWordBreakIndexFrom(this.pointer) : this.pointer + 1;
        return true;
      }
      if (event.keyCode === KEY_CODE.UP) {
        this.pointerToPreviousLine();
        return true;
      }
      if (event.keyCode === KEY_CODE.DOWN) {
        this.pointerToNextLine();
        return true;
      }
    }

    if (event.keyCode === KEY_CODE.SHIFT) {
      (this.blocks[this.correspondPointer].kunkunsi as Note).toggleTouch();
      return true;
    } else if (event.keyCode === KEY_CODE.ALT) {
      (this.blocks[this.correspondPointer].kunkunsi as Note).toggleSwing();
      return true;
    }

    return false;
  }
}
