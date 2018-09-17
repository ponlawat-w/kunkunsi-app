import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EditorService } from '../../../services/editor.service';
import { Project } from '../../../classes/project';
import { Block } from '../../../classes/block';
import { Note } from '../../../classes/note';
import { SpecialNote } from '../../../enums/note';
import { NoteSymbol } from '../../../classes/note-symbol';
import { KunKunSiPrintLyric } from '../../../classes/kunkunsi-byte';

@Component({
  selector: 'app-print-vertical',
  templateUrl: './print-vertical.component.html',
  styleUrls: ['./print-vertical.component.css']
})
export class PrintVerticalComponent implements OnInit, OnChanges {

  @Input() blockPerLine: number;
  @Input() linePerPage: number;

  @Input() lyricSize: number;

  private lines: Block[][];
  private indices: number[][];
  public JSON = JSON;

  constructor(public editorService: EditorService) { }

  public get title(): string {
    return this.editorService.title;
  }

  public get description(): string {
    return this.editorService.description;
  }

  public get project(): Project {
    return this.editorService.project;
  }

  public get blocks(): Block[] {
    return this.project.blocks;
  }

  public get lineSize(): number {
    return this.lines.length;
  }

  public get pages(): number {
    return Math.ceil(this.lineSize / this.linePerPage);
  }

  public get pageRange(): number[] {
    return this.range(0, this.pages ? this.pages : 1);
  }

  public pageFullWidth(page: number): string {
    return page.toString(10).replace('0', '０')
      .replace('1', '１')
      .replace('2', '２')
      .replace('3', '３')
      .replace('4', '４')
      .replace('5', '５')
      .replace('6', '６')
      .replace('7', '７')
      .replace('8', '８')
      .replace('9', '９');
  }

  public range(from: number, to: number): number[] {
    const arr = [];
    for (let i = from; i < to; i++) {
      arr.push(i);
    }
    return arr;
  }

  public lineRange(page: number): number[] {
    const startPage = page ? page * this.linePerPage : 0;
    const endPage = startPage + this.linePerPage;
    return this.range(startPage, endPage);
  }

  ngOnInit() {
    this.calculateLine();
  }

  ngOnChanges() {
    this.calculateLine();
  }

  private calculateLine() {
    this.lines = [];
    this.indices = [];

    let currentLine = 0;
    let indexOfLine = 0;
    this.project.blocks.forEach((block, index) => {
      if (!this.lines[currentLine]) {
        this.lines[currentLine] = [];
        this.indices[currentLine] = [];
      }

      this.lines[currentLine].push(block);
      this.indices[currentLine].push(index);

      if (block.kunkunsi instanceof Note && !this.project.isSingleDiminutive(index)) {
        indexOfLine += this.project.isMultiDiminutive(index) ? 0.5 : 1;
      }

      if (indexOfLine >= this.blockPerLine || block.kunkunsi.value === SpecialNote.NewLine) {
        indexOfLine = 0;
        currentLine++;
      }
    });

    if (this.lines[currentLine]) {
      currentLine++;
    }

    const lyricsLine = this.project.additionalLyrics ? this.project.additionalLyrics.split('\n\n') : [];
    lyricsLine.forEach(lyrics => {
      const block = new Block(new KunKunSiPrintLyric());
      block.lyric = lyrics;

      this.indices[currentLine] = [0];
      this.lines[currentLine++] = [block];
    });
  }

}
