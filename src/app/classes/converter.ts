import { Project } from './project';
import { Note } from './note';
import { SpecialNote } from '../enums/note';
import { NoteSymbol } from './note-symbol';

declare const TextDecoder;
declare const TextEncoder;

export class Converter {

  public static projectToBytes(project: Project): Uint8Array {
    const byteInts: number[] = [];
    const lyrics: string[] = [];
    project.blocks.forEach(block => {
      byteInts.push(block.kunkunsi.value);
      lyrics.push(block.lyric);

      if (block.kunkunsi instanceof Note) {
        const note = block.kunkunsi as Note;
        if (note.shift) {
          byteInts.push(note.shift);
        }
      }
    });

    byteInts.push(SpecialNote.End);
    const info = {
      title: project.title,
      description: project.description,
      lyrics: lyrics,
      moreLyrics: project.additionalLyrics
    };
    const infoBytes = (new TextEncoder()).encode(JSON.stringify(info));

    return (new Uint8Array(byteInts.concat(Array.from(infoBytes))));
  }

  public static bytesToProject(bytes: Uint8Array): Project {
    const endIndex: number = bytes.findIndex(byte => byte === SpecialNote.End);

    let data: Uint8Array;
    if (endIndex > 0) {
      data = bytes.slice(0, endIndex);
    } else if (!endIndex) {
      data = new Uint8Array([]);
    } else {
      data = bytes;
    }

    const project = new Project();
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];

      if (Note.isValidNote(byte) || Note.isSpace(byte)) {
        const note = new Note(byte);
        project.insertNote(note);
      } else if (NoteSymbol.isFlatSharp(byte) && project.blocks.length) {
        project.blocks[project.blocks.length - 1].setShift(byte);
      } else if (NoteSymbol.isValidSymbol(byte)) {
        const symbol = new NoteSymbol(byte);
        project.insertSymbol(symbol);
      }
    }

    if (endIndex > -1) {
      const footer = bytes.slice(endIndex + 1);
      const info = JSON.parse((new TextDecoder()).decode(footer));
      project.title = info.title ? info.title : null;
      project.description = info.description ? info.description : null;
      project.additionalLyrics = info.moreLyrics ? info.moreLyrics : null;
      info.lyrics.forEach((lyric, index) => {
        if (!project.validIndex(index)) {
          return true;
        }
        project.blocks[index].lyric = lyric;
      });
    }

    return project;
  }
}
