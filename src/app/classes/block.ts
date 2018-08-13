import { KunKunSiByte } from './kunkunsi-byte';
import { Note } from './note';
import { NoteSymbol } from './note-symbol';
import { SpecialNote } from '../enums/note';

export class Block {
    public kunkunsi: KunKunSiByte;
    private _lyric: string;

    constructor (kunkunsi: KunKunSiByte) {
        this.kunkunsi = kunkunsi;
        this.lyric = '';
    }

    set lyric(lyric: string) {
        if (this.kunkunsi instanceof Note) {
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

    get classes(): string[] {
        if (this.kunkunsi instanceof Note) {
            return ['block', 'block-note'];
        }

        if (this.kunkunsi instanceof NoteSymbol) {
            switch (this.kunkunsi.value) {
                case SpecialNote.NewLine:
                    return ['block', 'block-newline'];
            }
        }

        return [];
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
}
