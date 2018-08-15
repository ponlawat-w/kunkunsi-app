import { Block } from './block';
import { Note } from './note';
import { NoteSymbol } from './note-symbol';
import { SpecialNote, GeneralNote } from '../enums/note';

const symbolWithOwnBlock = [
    SpecialNote.ArrowRepeatBegin,
    SpecialNote.ArrowRepeatEnd,
    SpecialNote.CircleRepeatBegin,
    SpecialNote.CircleRepeatEnd,
    SpecialNote.NewLine
];

const WORD_BREAK = [
  GeneralNote.Space,
  SpecialNote.ArrowRepeatBegin,
  SpecialNote.ArrowRepeatEnd,
  SpecialNote.CircleRepeatBegin,
  SpecialNote.CircleRepeatEnd,
  SpecialNote.End,
  SpecialNote.NewLine
];

const LINE_BREAK = [
  SpecialNote.End,
  SpecialNote.NewLine
];

const MARK = [
    SpecialNote.ArrowRepeatBegin,
    SpecialNote.ArrowRepeatEnd,
    SpecialNote.CircleRepeatBegin,
    SpecialNote.CircleRepeatEnd
];

export class Project {
    public title: string;
    public blocks: Block[];

    public description: string;
    public additionalLyrics: string;

    public static fromJsonObject(jsonObj: any): Project {
        const proj = new Project();
        proj.title = jsonObj.title ? jsonObj.title : null;
        proj.description = jsonObj.description ? jsonObj.description : null;
        proj.additionalLyrics = jsonObj.additionalLyrics ? jsonObj.additionalLyrics : null;
        jsonObj.blocks.forEach(blockObj => {
            const byte = blockObj.kunkunsi.value;
            const block = new Block();
            if (Note.isValidNote(byte) || Note.isSpace(byte)) {
                const note = new Note(byte);
                note.shift = blockObj.kunkunsi.shift;
                block.kunkunsi = note;
            } else {
                const symbol = new NoteSymbol(byte);
                block.kunkunsi = symbol;
            }
            block.lyric = blockObj._lyric ? blockObj._lyric : null;
            proj.blocks.push(block);
        });
        return proj;
    }

    constructor() {
        this.title = '';
        this.blocks = [];
        this.description = '';
        this.additionalLyrics = '';
    }

    public isWordBreak(index: number): boolean {
      return this.validIndex(index) ? WORD_BREAK.indexOf(this.blocks[index].kunkunsi.value) > -1 : true;
    }

    public isLineBreak(index: number): boolean {
      return this.validIndex(index) ? LINE_BREAK.indexOf(this.blocks[index].kunkunsi.value) > -1 : true;
    }

    public isMark(index: number): boolean {
        return this.validIndex(index) ? MARK.indexOf(this.blocks[index].kunkunsi.value) > -1 : false;
    }

    private insertBlock(block: Block, index = -1): void {
        if (index < 0 || index === this.blocks.length) {
            this.blocks.push(block);
            return;
        }

        if (this.validIndex(index)) {
            this.blocks.splice(index, 0, block);
        }
    }

    public validIndex(index: number) {
        return index > -1 && index < this.blocks.length;
    }

    public previousWordBreakIndexFrom(index: number): number {
        do {
            index--;
        } while (!this.isWordBreak(index));

        return this.validIndex(index) ? index : 0;
    }

    public nextWordBreakIndexFrom(index: number): number {
        do {
            index++;
        } while (!this.isWordBreak(index));

        return this.validIndex(index) ? index : this.blocks.length;
    }

    public previousLineBreakIndexFrom(index: number): number {
        do {
            index--;
        } while (!this.isLineBreak(index));

        return this.validIndex(index) ? index : 0;
    }

    public nextLineBreakIndexFrom(index: number): number {
        do {
            index++;
        } while (!this.isLineBreak(index));

        return this.validIndex(index) ? index : this.blocks.length;
    }

    public insertNote(note: Note, index = -1): void {
        this.insertBlock(new Block(note), index);
    }

    public insertSymbol(symbol: NoteSymbol, index = -1): void {
        if (symbolWithOwnBlock.indexOf(symbol.value) > -1) {
            this.insertBlock(new Block(symbol), index);
        }
    }

    public deleteOne(index: number): void {
        if (this.validIndex(index)) {
            this.blocks.splice(index, 1);
        }
    }

    public deleteCount(index: number, count: number): void {
        if (this.validIndex(index)) {
            this.blocks.splice(index, count);
        }
    }

    public deleteSpan(from: number, to: number): void {
        if (this.validIndex(from) && to >= from) {
            this.blocks.splice(from, to - from);
        }
    }

    public clear() {
        this.title = '';
        this.blocks = [];
    }

    public isEmptyLine(index: number): boolean {
        return this.isLineBreak(index) && this.isLineBreak(index + 1);
    }

    public isEmptyLineTrimmed(index: number): boolean {
        if (!this.validIndex(index)) {
            return true;
        }
        const prev = this.previousLineBreakIndexFrom(index);
        const next = this.nextLineBreakIndexFrom(index);
        for (let i = prev; i < next; i++) {
            if (!this.isWordBreak(i)) {
                return false;
            }
        }

        return true;
    }

    public isDiminutive(index: number): boolean {
        if (!this.validIndex(index)) {
            return false;
        }
        return (this.blocks[index].kunkunsi instanceof Note) ? (this.blocks[index].kunkunsi as Note).isDiminutive() : false;
    }

    public isSingleDiminutive(index: number): boolean {
        return this.validIndex(index) && this.isDiminutive(index)
            && (this.validIndex(index - 1) && !this.isDiminutive(index - 1))
            && (this.validIndex(index + 1) && !this.isDiminutive(index + 1));
    }

    public isMultiDiminutive(index: number): boolean {
        return this.isDiminutive(index) && !this.isSingleDiminutive(index);
    }

    public isNote(index: number): boolean {
        return this.validIndex(index) ? Note.isValidNote(this.blocks[index].kunkunsi.value) : false;
    }

    public isSpace(index: number): boolean {
        return this.validIndex(index) ? this.blocks[index].kunkunsi.value === GeneralNote.Space : false;
    }

    public lyricable(index: number): boolean {
        return this.validIndex(index) ? this.isNote(index) || this.isSpace(index) : false;
    }

    public clone(): Project {
        const newProj = new Project();
        newProj.title = this.title;
        newProj.blocks = this.blocks.map(block => block.clone());
        return newProj;
    }
}
