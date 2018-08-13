export enum GeneralNote {
    Space = 0b000000
}

export enum NoteMark {
    Touch = 0b01000000,
    Swing = 0b10000000,
    Diminutive = 0b00100000
}

export enum NoteShift {
    None = 0,
    Flat = 0b11001000,
    Sharp = 0b11001001
}

export enum SpecialNote {
    NewLine = 0b11000000,
    Flat = NoteShift.Flat,
    Sharp = NoteShift.Sharp,
    ArrowRepeatBegin = 0b11010000,
    ArrowRepeatEnd = 0b11010001,
    CircleRepeatBegin = 0b11010010,
    CircleRepeatEnd = 0b11010011,
    End = 0b11111111
}
