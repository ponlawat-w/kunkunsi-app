export abstract class KunKunSiByte {
    public value: number;

    public static isValid(byteValue: number) {
        return !(byteValue > 0xFF || byteValue < 0);
    }

    constructor(value: number) {
        this.value = value;
    }

    public abstract clone();
}

export class KunKunSiPrintLyric extends KunKunSiByte {
    constructor() {
        super(null);
    }

    public clone(): KunKunSiPrintLyric {
        return new KunKunSiPrintLyric();
    }
}
