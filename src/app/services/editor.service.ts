import { Injectable } from '@angular/core';
import { Project } from '../classes/project';
import { Block } from '../classes/block';
import { NOTE_KEY, KEY_CODE, SPECIAL_KEY } from '../consts/note-key';
import { Note } from '../classes/note';
import { SpecialNote, GeneralNote, NoteMark, NoteShift } from '../enums/note';
import { AppService } from './app.service';
import { NoteSymbol } from '../classes/note-symbol';
import { ViewService } from './view.service';
import { HistoryService } from './history.service';
import { HttpClient } from '@angular/common/http';
import { FileReaderEventTarget } from './file.service';
import { Converter } from '../classes/converter';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private keyWithLetter: boolean;

  public project: Project;
  private _pointer: number;

  private keyMap: object;
  private specialMap: object;

  public lyricEditIndex: number;
  public lyricEditText: string;

  public focus: boolean;

  constructor(
    public appService: AppService,
    public viewService: ViewService,
    public historyService: HistoryService,
    public http: HttpClient
  ) {
    this.focus = false;
    this.project = new Project();
    this._pointer = 0;
    this.keyMap = NOTE_KEY.QWERTY;
    this.specialMap = SPECIAL_KEY.QWERTY;
    this.lyricEditIndex = -1;
    this.lyricEditText = null;
    this.loadLocalStorage();
    this.pushHistory();
  }

  get title(): string {
    return this.project.title ? this.project.title : '無タイトル';
  }

  set title(newtitle: string) {
    this.project.title = newtitle.trim();
    this.pushHistory();
  }

  get description(): string {
    return this.project.description;
  }

  set description(d: string) {
    this.project.description = d;
    this.pushHistory();
  }

  get additionalLyrics(): string {
    return this.project.additionalLyrics;
  }

  set additionalLyrics(l: string) {
    this.project.additionalLyrics = l;
    this.pushHistory();
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
    if (position < -1) {
      this._pointer = -1;
      return;
    }

    if (position > this.project.blocks.length - 1) {
      this._pointer = this.project.blocks.length - 1;
      return;
    }

    this._pointer = position;
  }

  get preventKeyEvent(): boolean {
    if (this.lyricEditIndex === this.project.blocks.length) {
      this.lyricEditIndex = -1;
      return true;
    }
    return this.lyricEditIndex > -1;
  }

  public newProject(autofocus: boolean = true): void {
    this.historyService.clear();
    this.lyricEditIndex = -1;
    this.project = new Project();
    this.pointer = 0;
    this.pushHistory();
    if (autofocus) {
      this.viewService.editorElement.focus();
    }
  }

  public loadLocalStorage(): boolean {
    const json = localStorage.getItem('project');
    if (json) {
      const obj = JSON.parse(json);
      if (obj && (obj.title || obj.blocks.length)) {
        this.project = Project.fromJsonObject(obj);
        return true;
      }
      localStorage.setItem('project', null);
    }

    return false;
  }

  public loadData(data: Blob): void {
    const reader = new FileReader();
    reader.onload = event => {
      const target: FileReaderEventTarget = event.target as FileReaderEventTarget;
      this.newProject(false);
      this.project = Converter.bytesToProject(new Uint8Array(target.result));
      this.pointer = 0;
      this.pushHistory();
    };
    reader.readAsArrayBuffer(data);
  }

  public pushHistory(): void {
    this.historyService.push(this.project);
  }

  public undo(): void {
    const p = this.historyService.undo();
    if (p) {
      this.project = p;
    }
  }

  public redo(): void {
    const p = this.historyService.redo();
    if (p) {
      this.project = p;
    }
  }

  public editLyricStart(index: number): void {
    if (!this.project.lyricable(index)) {
      return;
    }

    this.lyricEditIndex = index;
    this.lyricEditText = this.project.blocks[index].lyric;
  }

  public editLyricStop(): void {
    this.viewService.editorElement.focus();
    this.lyricEditIndex = -1;
    this.lyricEditText = null;
  }

  public editLyricSubmit(): void {
    if (this.project.lyricable(this.lyricEditIndex)) {
      this.project.blocks[this.lyricEditIndex].lyric = this.lyricEditText;
    }
    this.pointer = this.lyricEditIndex;
    this.editLyricStop();
    this.editNextLyric();
    this.pushHistory();
  }

  public editNextLyric(): void {
    while (this.project.validIndex(this.pointer + 1)) {
      this.pointer++;
      if (this.project.lyricable(this.pointer)) {
        this.editLyricStart(this.pointer);
        return;
      }
    }

    this.editLyricStop();
    this.focus = false;
    this.viewService.editorElement.blur();
  }

  public editPreviousLyric(): void {
    do {
      this.pointer--;
      if (this.project.lyricable(this.pointer)) {
        this.editLyricStart(this.pointer);
        return;
      }
    } while (this.pointer > 0);
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
    if (this.preventKeyEvent) {
      return;
    }

    if ((!this.keyMap[event.key] && !KEY_CODE[event.keyCode]) || event.shiftKey || event.altKey) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.keyWithLetter = false;
  }

  public onkeyup(event: KeyboardEvent): boolean {
    if (this.preventKeyEvent) {
      return false;
    }

    if (event.ctrlKey) {
      if (event.key === 'z') {
        this.undo();
        return true;
      } else if (event.key === 'y') {
        this.redo();
        return true;
      }
    }

    const pointToLast = this.pointer === this.blocks.length - 1;

    const key = event.key.toLowerCase();
    if (typeof this.keyMap[key] !== 'undefined') {
      let note = this.keyMap[key];
      if (event.shiftKey) {
        this.keyWithLetter = true;
        note |= NoteMark.Touch;
      } else if (event.altKey) {
        this.keyWithLetter = true;
        note |= NoteMark.Swing;
      }
      this.project.insertNote(new Note(note), ++this.pointer);
      if (pointToLast) {
        this.pointer++;
      }
      this.pushHistory();
      return true;
    }

    if (typeof this.specialMap[event.key] !== 'undefined') {
      const mark = this.specialMap[event.key];
      this.project.insertSymbol(new NoteSymbol(mark), ++this.pointer);
      if (pointToLast) {
        this.pointer++;
      }
      this.pointer++;
      if (event.shiftKey) {
        this.keyWithLetter = true;
      }
      this.pushHistory();
      return true;
    }

    if (event.key === '1') {
      if (this.project.validIndex(this.correspondPointer)) {
        this.project.blocks[this.correspondPointer].toggleDiminutive();
        this.pushHistory();
      }
      return true;
    }

    if (event.key === '2') {
      this.editLyricStart(this.correspondPointer);
      return true;
    }

    if (event.key === ',') {
      if (this.project.validIndex(this.correspondPointer)) {
        const note = this.project.blocks[this.correspondPointer].kunkunsi as Note;
        note.shift = note.shift === NoteShift.Sharp ? NoteShift.None : NoteShift.Sharp;
        this.pushHistory();
      }
      return true;
    }
    if (event.key === '.') {
      if (this.project.validIndex(this.correspondPointer)) {
        const note = this.project.blocks[this.correspondPointer].kunkunsi as Note;
        note.shift = note.shift === NoteShift.Flat ? NoteShift.None : NoteShift.Flat;
        this.pushHistory();
      }
      return true;
    }

    if (event.keyCode === KEY_CODE.SPACEBAR) {
      this.project.insertNote(new Note(GeneralNote.Space), ++this.pointer);
      if (pointToLast) {
        this.pointer++;
      }
      this.pushHistory();
      return true;
    }

    if (event.keyCode === KEY_CODE.ENTER) {
      this.project.insertSymbol(new NoteSymbol(SpecialNote.NewLine), ++this.pointer);
      if (pointToLast) {
        this.pointer++;
      }
      this.pushHistory();
      return true;
    }

    if (event.keyCode === KEY_CODE.BACKSPACE) {
      if (event.ctrlKey) {
        let wordBreak = this.project.previousWordBreakIndexFrom(this.pointer) + 1;
        wordBreak = wordBreak === this.pointer ? wordBreak - 1 : wordBreak;
        this.project.deleteSpan(wordBreak, this.pointer);
        this.pointer = wordBreak - 1;
        this.pushHistory();
        return true;
      }
      this.project.deleteOne(this.pointer--);
      this.pushHistory();
      return true;
    }

    if (event.keyCode === KEY_CODE.DELETE) {
      if (event.ctrlKey) {
        let wordBreak = this.project.nextWordBreakIndexFrom(this.pointer);
        wordBreak = wordBreak === this.pointer + 1 ? this.project.nextWordBreakIndexFrom(wordBreak) : wordBreak;
        this.project.deleteSpan(this.pointer + 1, wordBreak - 1);
        this.pushHistory();
        return true;
      }
      this.project.deleteOne(this.pointer + 1);
      this.pushHistory();
      return true;
    }

    if (event.keyCode === KEY_CODE.HOME) {
      this.pointer = this.project.previousLineBreakIndexFrom(this.pointer);
      if (this.pointer > 0) {
        this.pointer++;
      }
      if (this.pointer === 0) {
        this.pointer--;
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

    if (!this.keyWithLetter) {
      if (event.keyCode === KEY_CODE.SHIFT) {
        if (this.project.validIndex(this.correspondPointer)) {
          (this.blocks[this.correspondPointer].kunkunsi as Note).toggleTouch();
          this.pushHistory();
        }
        return true;
      } else if (event.keyCode === KEY_CODE.ALT) {
        if (this.project.validIndex(this.correspondPointer)) {
          (this.blocks[this.correspondPointer].kunkunsi as Note).toggleSwing();
          this.pushHistory();
        }
        return true;
      }
    }

    if (event.keyCode === KEY_CODE.ESC) {
      this.focus = false;
      this.viewService.editorElement.blur();
      return false;
    }

    return false;
  }
}
