import { KunKunSiByte } from './kunkunsi-byte';
import { SpecialNote } from '../enums/note';

export class NoteSymbol extends KunKunSiByte {

    public static isValidSymbol(value: number) {
        return (Object.values(SpecialNote).includes(value));
    }

    public static isFlatSharp(value: number) {
        return value === SpecialNote.Flat || value === SpecialNote.Sharp;
    }

    public static isMark(value: number) {
        return [
            SpecialNote.ArrowRepeatBegin, SpecialNote.ArrowRepeatEnd,
            SpecialNote.CircleRepeatBegin, SpecialNote.CircleRepeatEnd
        ].indexOf(value) > -1;
    }
}
