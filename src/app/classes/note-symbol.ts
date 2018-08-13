import { KunKunSiByte } from './kunkunsi-byte';
import { SpecialNote } from '../enums/note';

export class NoteSymbol extends KunKunSiByte {

    public static isValidSymbol(value: number) {
        return (Object.values(SpecialNote).includes(value));
    }
}
