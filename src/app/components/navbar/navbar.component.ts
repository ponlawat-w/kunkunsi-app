import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { LayoutAlignment } from '../../enums/layout-alignment';
import { EditorService } from '../../services/editor.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public appService: AppService,
    public editorService: EditorService,
    public fileService: FileService
  ) { }

  ngOnInit() {
  }

  public setVertical(): void {
    this.appService.setLayout(LayoutAlignment.Vertical);
  }

  public setHorizontal(): void {
    this.appService.setLayout(LayoutAlignment.Horizontal);
  }

  public newProject(): void {
    if (!this.editorService.project.blocks.length || confirm('新しい工工四を作成しますか。')) {
      this.editorService.newProject();
    }
  }

  public print(): void {
    window.print();
  }

}
