import { Injectable } from '@angular/core';
import { Project } from '../classes/project';
import { Note } from '../classes/note';
import { SpecialNote } from '../enums/note';
import { NoteSymbol } from '../classes/note-symbol';
import { EditorService } from './editor.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    public editorService: EditorService
  ) { }

  public save(): void {
    const blob: Blob = new Blob([this.projectToBytes(this.editorService.project)], {
      type: 'data:applcation/kunkunsi-note'
    });

    const url = window.URL.createObjectURL(blob);
    const $a = document.createElement('a');
    $a.setAttribute('href', url);
    $a.setAttribute('download', this.editorService.title + '.kks');
    $a.click();
    window.URL.revokeObjectURL(url);
    $a.remove();
  }

  public load(): void {
    const $file: HTMLInputElement = document.createElement('input');
    $file.setAttribute('type', 'file');
    $file.click();
    $file.addEventListener('change', () => {
      if (!$file.files.length) {
        return;
      }

      const file = $file.files[0];
      const fileReader = new FileReader();
      fileReader.onload = event => {
        this.editorService.project = this.bytesToProject(new Uint8Array(event.target.result));
        this.editorService.pointer = 0;
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  public projectToBytes(project: Project): Uint8Array {
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
      lyrics: lyrics
    };
    const infoBytes = (new TextEncoder()).encode(JSON.stringify(info));

    return (new Uint8Array(byteInts.concat(Array.from(infoBytes))));
  }

  public bytesToProject(bytes: Uint8Array): Project {
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
      project.title = info.title;
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
