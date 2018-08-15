import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorService } from '../../services/editor.service';
import { AppService } from '../../services/app.service';
import { NgbModal, NgbModalRef } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  @ViewChild('editDialog') modalElement;
  public modalRef: NgbModalRef;

  public newTitle: string;

  constructor(
    public appService: AppService,
    public editorService: EditorService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {}

  public get unititled(): boolean {
    return !this.editorService.project.title;
  }

  startEditing(): void {
    this.newTitle = this.editorService.project.title;
    this.modalRef = this.modalService.open(this.modalElement, { size: 'lg' });
  }

  submitTitle(): void {
    this.modalRef.close();
    this.editorService.title = this.newTitle;
  }

}
