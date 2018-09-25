import { SpecialNote } from '../enums/note';

export const NOTE_KEY = {
    QWERTY: {
        'z': 0b00001000,
        'x': 0b00001001,
        'c': 0b00001010,
        'v': 0b00001011,
        'b': 0b00001100,
        'n': 0b00001101,
        'm': 0b00001110,
        '/': 0b00001111,
        'a': 0b00010000,
        's': 0b00010001,
        'd': 0b00010010,
        'f': 0b00010011,
        'g': 0b00010100,
        'h': 0b00010101,
        'j': 0b00010110,
        'k': 0b00010111,
        'q': 0b00011000,
        'w': 0b00011001,
        'e': 0b00011010,
        'r': 0b00011011,
        't': 0b00011100,
        'y': 0b00011101,
        'u': 0b00011110,
        'i': 0b00011111
    }
};

export const SPECIAL_KEY = {
    QWERTY: {
        '[': SpecialNote.ArrowRepeatBegin,
        ']': SpecialNote.ArrowRepeatEnd,
        '{': SpecialNote.CircleRepeatBegin,
        '}': SpecialNote.CircleRepeatEnd
    }
};

export const KEY_CODE = {
    SPACEBAR: 32,
    DELETE: 46,
    BACKSPACE: 8,
    ENTER: 13,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    HOME: 36,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    SHIFT: 16,
    ALT: 18,
    ESC: 27,
    TAB: 9
};
