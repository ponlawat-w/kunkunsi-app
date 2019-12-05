import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { FileService } from '../../services/file.service';
import { EditorService } from '../../services/editor.service';

@Component({
  selector: 'app-github-importer',
  templateUrl: './github-importer.component.html',
  styleUrls: ['./github-importer.component.css']
})
export class GithubImporterComponent implements OnInit {

  @ViewChild('githubDialog', {static: true}) modalElement;
  public modalRef: NgbModalRef;
  @Input() emitter: EventEmitter<null>;

  public githubSettings: {username: string, repository: string} = {username: '', repository: ''};
  public username: string;
  public repositoryName: string;
  public paths: string[] = [];
  public items: FileItem[] = [];
  public loading = false;
  public error = null;

  public get apiUrl(): string {
    return `https://api.github.com/repos/${this.githubSettings.username}/${this.githubSettings.repository}/contents/`
      + this.paths.join('/');
  }

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private fileService: FileService,
    private editorService: EditorService
  ) { }

  ngOnInit() {
    this.emitter.subscribe(() => {
      this.openDialog();
    });

    const settingString = localStorage.getItem('github');
    if (settingString) {
      this.githubSettings = JSON.parse(settingString);
    } else {
      this.githubSettings = {
        username: 'ponlawat-w',
        repository: 'kunkunsi-db'
      };
    }
  }

  public openDialog(): void {
    this.modalRef = this.modalService.open(this.modalElement, {
      size: 'lg'
    });
    this.loadRepository();
  }

  public loadRepository(): void {
    this.error = null;
    this.items = [];
    this.paths = [];
    localStorage.setItem('github', JSON.stringify(this.githubSettings));
    this.username = this.githubSettings.username;
    this.repositoryName = this.githubSettings.repository;
    this.loadFileList();
  }

  public access(item: FileItem) {
    if (item.type === 'file') {
      this.loadFile(item);
    } else {
      this.goTo(item.name);
    }
  }

  public copyUrl(event: Event, item: FileItem) {
    const url = `${location.href}github/${this.username}/${this.repositoryName}/master/${item.path}`;
    document.addEventListener('copy', (clipboardEvent: ClipboardEvent) => {
      clipboardEvent.clipboardData.setData('text/plain', url);
      clipboardEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    event.stopPropagation();
  }

  public loadFile(item: FileItem) {
    this.loading = true;
    this.http.get(item.download_url, { responseType: 'blob' })
      .subscribe(data => {
        this.editorService.loadData(data);
        this.modalRef.dismiss();
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = `${err.status} - ${err.statusText}`;
      });
  }

  public goTo(directory: string) {
    this.paths.push(directory);
    this.loadFileList();
  }

  public goUp() {
    if (this.paths.length > 0) {
      this.paths.splice(this.paths.length - 1);
    }
    this.loadFileList();
  }

  public loadFileList(): void {
    this.loading = true;
    this.error = null;
    const url = this.apiUrl;
    this.http.get<FileItem[]>(url)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(val => {
        this.items = val.filter(item => item.type === 'dir' || this.getExtension(item) === 'kks')
          .map(item => this.normalizeName(item));
      }, (err: HttpErrorResponse) => {
        this.error = `${err.status} - ${err.statusText}`;
      });
  }

  public navigate(index: number): void {
    this.paths.splice(index + 1);
    this.loadFileList();
  }

  private getExtension(item: FileItem): string {
    const splited = item.name.split('.');
    return splited[splited.length - 1].toLowerCase();
  }

  private normalizeName(item: FileItem): FileItem {
    if (item.type === 'dir') {
      return item;
    }
    const splited = item.name.split('.');
    splited.splice(splited.length - 1);
    item.name = splited.join('.');
    return item;
  }

}

class FileItem {
  public name: string;
  public path: string;
  public sha: string;
  public size: number;
  public url: string;
  public html_url: string;
  public git_url: string;
  public download_url: string;
  public type: 'file'|'dir';
  public _links: {self: string, git: string, html: string};
}
