import { KunKunSiByte } from './kunkunsi-byte';
import { NoteMark, NoteShift, GeneralNote } from '../enums/note';

const NOTE_STRING = {
    0b00000: '〇',
    0b01000: '合',
    0b01001: '乙',
    0b01010: '老',
    0b01011: '下老',
    0b01100: '口上',
    0b01101: '口中',
    0b01110: '口乙',
    0b01111: '口老',
    0b10000: '四',
    0b10001: '上',
    0b10010: '中',
    0b10011: '尺',
    0b10100: '下尺',
    0b10101: '口五',
    0b10110: 'イ上',
    0b10111: 'イ中',
    0b11000: '工',
    0b11001: '五',
    0b11010: '六',
    0b11011: '七',
    0b11100: '八',
    0b11101: '九',
    0b11110: 'イ五',
    0b11111: 'イ六'
};

const MARK_STRING = {
    0b01000000: '‵',
    0b10000000: '⌝'
};

const SHIFT_STRING = {
    0b11001000: '♭',
    0b11001001: '♯'
};

export class Note extends KunKunSiByte {

    public shift: NoteShift = NoteShift.None;

    public static isSpace(byteValue: number): boolean {
        return byteValue === GeneralNote.Space;
    }

    public static isValidNote(byteValue: number): boolean {
        if (byteValue >> 6 === 0b11) {
            return false;
        }

        if (!(byteValue & 0b00011000)) {
            return false;
        }

        return true;
    }

    public toggleDiminutive(): void {
        if (this.value & NoteMark.Diminutive) {
            this.value &= (~NoteMark.Diminutive) & 0xFF;
        } else {
            this.value |= NoteMark.Diminutive;
        }
    }

    public clearTouchSwing(): void {
        this.value &= 0b00111111;
    }

    public toggleTouch(): void {
        if (this.value & NoteMark.Touch) {
            this.value &= (~NoteMark.Touch) & 0xFF;
        } else {
            this.clearTouchSwing();
            this.value |= NoteMark.Touch;
        }
    }

    public toggleSwing(): void {
        if (this.value & NoteMark.Swing) {
            this.value &= (~NoteMark.Swing) & 0xFF;
        } else {
            this.clearTouchSwing();
            this.value |= NoteMark.Swing;
        }
    }

    public toLetter(): string {
        return NOTE_STRING[this.value & 0b00011111];
    }

    public toMark(): string {
        const mark = this.value & 0b11000000;
        return MARK_STRING[mark];
    }

    public toShift(): string {
        if (this.shift === NoteShift.Sharp) {
            return SHIFT_STRING[this.shift];
        }
        if (this.shift === NoteShift.Flat) {
            return SHIFT_STRING[this.shift];
        }

        return null;
    }

    public isDiminutive(): boolean {
        return (this.value & 0b00100000) ? true : false;
    }

    public clone(): Note {
        const note = new Note(this.value);
        note.shift = this.shift;
        return note;
    }
}
