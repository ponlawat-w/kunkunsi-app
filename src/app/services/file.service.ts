import { Injectable } from '@angular/core';
import { Project } from '../classes/project';
import { EditorService } from './editor.service';
import { Converter } from '../classes/converter';

export interface FileReaderEventTarget extends EventTarget {
  result: Uint8Array;
}

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
    $a.setAttribute('download',
      this.editorService.title.replace(/\[(.+?)\]\((.+?)\)/g, '$1')
      + '.kks');
    document.body.appendChild($a);
    $a.click();
    document.body.removeChild($a);
    window.URL.revokeObjectURL(url);
    $a.remove();
  }

  public load(): void {
    const $oldFile = document.getElementById('load-file-input');
    if ($oldFile) {
      $oldFile.remove();
    }

    const $file: HTMLInputElement = document.createElement('input');
    $file.setAttribute('type', 'file');
    $file.setAttribute('id', 'load-file-input');
    $file.click();
    $file.addEventListener('change', () => {
      if (!$file.files.length) {
        return;
      }

      const file = $file.files[0];
      const fileReader = new FileReader();
      fileReader.onload = event => {
        const target: FileReaderEventTarget = event.target as FileReaderEventTarget;
        this.editorService.newProject(false);
        this.editorService.project = this.bytesToProject(new Uint8Array(target.result));
        this.editorService.pointer = 0;
        this.editorService.pushHistory();
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  public projectToBytes(project: Project): Uint8Array {
    return Converter.projectToBytes(project);
  }

  public bytesToProject(bytes: Uint8Array): Project {
    return Converter.bytesToProject(bytes);
  }
}
