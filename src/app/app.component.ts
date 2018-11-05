import { Component, OnInit } from '@angular/core';
import { AppService } from './services/app.service';
import { EditorService } from './services/editor.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public loading = false;

  constructor(
    public appService: AppService,
    public editorService: EditorService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.readUrl();
  }

  private clearUrl(): void {
    history.replaceState(null, document.title, '/');
  }

  private readUrl(): void {
    const paths = window.location.pathname.split('/');
    if (paths.length > 1) {
      const source = paths[1];
      if (source === 'github' && paths.length > 3)  {
        this.readGitHub(paths.slice(2));
        return;
      } else if (source === 'new') {
        this.editorService.newProject(false);
      }
    }

    this.clearUrl();
  }

  private readGitHub(paths: string[]) {
    this.loading = true;
    const url = `https://raw.githubusercontent.com/${paths.join('/')}`;
    this.http.get(url, { responseType: 'blob' })
      .subscribe(data => {
        this.clearUrl();
        this.loading = false;
        this.editorService.loadData(data);
      }, (error: HttpErrorResponse) => {
        this.clearUrl();
        this.loading = false;
        alert(`GitHubから読み込めません（${error.status} - ${error.statusText}）`);
      });
  }
}
