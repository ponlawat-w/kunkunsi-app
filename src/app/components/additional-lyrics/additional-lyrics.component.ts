import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorService } from '../../services/editor.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-additional-lyrics',
  templateUrl: './additional-lyrics.component.html',
  styleUrls: ['./additional-lyrics.component.css']
})
export class AdditionalLyricsComponent implements OnInit {

  @ViewChild('lyricsDialog') modalElement;
  public modalRef: NgbModalRef;
  public additionalLyrics: string;

  constructor(
    public editorService: EditorService,
    public appService: AppService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  public startEditing(): void {
    this.additionalLyrics = this.editorService.additionalLyrics;
    this.modalRef = this.modalService.open(this.modalElement, {
      size: 'lg'
    });
  }

  public submitLyrics(): void {
    this.editorService.additionalLyrics = this.additionalLyrics;
    this.modalRef.dismiss();
  }
}
