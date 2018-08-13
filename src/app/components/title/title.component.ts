import { Component, OnInit } from '@angular/core';
import { EditorService } from '../../services/editor.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  editing: boolean;
  newTitle: string;

  constructor(public appService: AppService, public editorService: EditorService) { }

  ngOnInit() {}

  toggleEditing(): void {
    this.editing = !this.editing;
    if (this.editing) {
      this.newTitle = this.editorService.project.title;
    }
  }

  submitTitle(): void {
    this.editorService.title = this.newTitle;
    this.toggleEditing();
  }

}
