import { KunKunSiByte, KunKunSiPrintLyric } from './kunkunsi-byte';
import { Note } from './note';
import { NoteSymbol } from './note-symbol';
import { SpecialNote } from '../enums/note';

export class Block {
    public kunkunsi: KunKunSiByte;
    private _lyric: string;

    constructor (kunkunsi: KunKunSiByte = null) {
        this.kunkunsi = kunkunsi;
        this.lyric = '';
    }

    set lyric(lyric: string) {
        if (this.kunkunsi instanceof Note || this.kunkunsi instanceof KunKunSiPrintLyric) {
            this._lyric = lyric;
        }
    }

    get lyric(): string {
        return this._lyric;
    }

    get mark(): string {
        if (!(this.kunkunsi instanceof Note)) {
            return null;
        }
        const markTouch = this.kunkunsi.value & 0b11000000;
        return (this.kunkunsi as Note).toMark();
    }

    public get shift(): string {
        if (!(this.kunkunsi instanceof Note)) {
            return null;
        }
        return (this.kunkunsi as Note).toShift();
    }

    get block(): boolean {
        return (this.kunkunsi instanceof Note) ||
            (this.kunkunsi instanceof NoteSymbol && this.kunkunsi.value === SpecialNote.NewLine);
    }

    get classes(): string[] {
        if (this.kunkunsi instanceof Note) {
            return ['block', 'block-note'];
        }

        if (this.kunkunsi instanceof NoteSymbol) {
            switch (this.kunkunsi.value) {
                case SpecialNote.NewLine:
                    return ['block', 'block-newline'];
                case SpecialNote.ArrowRepeatBegin:
                    return ['repeat', 'repeat-begin', 'repeat-arrow'];
                case SpecialNote.ArrowRepeatEnd:
                    return ['repeat', 'repeat-end', 'repeat-arrow'];
                case SpecialNote.CircleRepeatBegin:
                    return ['repeat', 'repeat-begin', 'repeat-circle'];
                case SpecialNote.CircleRepeatEnd:
                    return ['repeat', 'repeat-end', 'repeat-circle'];
            }
        }

        return [];
    }

    get type(): string {
        if (this.kunkunsi instanceof Note) {
            return 'Note';
        }
        if (this.kunkunsi instanceof NoteSymbol) {
            return 'NoteSymbol';
        }
        if (this.kunkunsi instanceof KunKunSiPrintLyric) {
            return 'Lyrics';
        }
        return 'undefined';
    }

    public setShift(byte: number): void {
        if (this.kunkunsi instanceof Note && NoteSymbol.isFlatSharp(byte)) {
            (this.kunkunsi as Note).shift = byte;
        }
    }

    public toggleDiminutive(): void {
        if (this.kunkunsi instanceof Note) {
            (this.kunkunsi as Note).toggleDiminutive();
        }
    }

    public toString(): string {
        if (this.kunkunsi instanceof Note) {
            return (this.kunkunsi as Note).toLetter();
        }
    }

    public clone(): Block {
        const block = new Block(this.kunkunsi.clone());
        block.lyric = this.lyric;
        return block;
    }
}
