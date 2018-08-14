import { Component, OnInit, Input } from '@angular/core';
import { EditorService } from '../../../services/editor.service';
import { Block } from '../../../classes/block';

@Component({
  selector: 'app-print-horizontal',
  templateUrl: './print-horizontal.component.html',
  styleUrls: ['./print-horizontal.component.css']
})
export class PrintHorizontalComponent implements OnInit {

  @Input() sizePerLine: number;
  @Input() sizePerPage: number;

  public get title(): string {
    return this.editorService.title;
  }

  public get blocks(): Block[] {
    return this.editorService.blocks;
  }

  constructor(public editorService: EditorService) { }

  ngOnInit() {
  }

}
