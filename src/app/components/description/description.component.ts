import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorService } from '../../services/editor.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  @ViewChild('editDescription', {static: true}) modalElement;

  public description: string;
  public modalRef: NgbModalRef;

  constructor(
    public editorService: EditorService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  public startEditing(): void {
    this.description = this.editorService.description;
    this.modalRef = this.modalService.open(this.modalElement);
  }

  public submitEdit(): void {
    this.modalRef.close();
    this.editorService.description = this.description;
  }

}
