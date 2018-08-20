import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { PaperOrientation } from '../../enums/layout-alignment';
import { ViewService } from '../../services/view.service';

const DEFAULT_BLOCK_PER_LINE = 9;
const DEFAULT_LINE_PER_PAGE = 11;
const DEFAULT_ORIENTATION = PaperOrientation.Portrait;
const DEFAULT_LYRIC_SIZE = 1.5;

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  public paperOrientationEnum = PaperOrientation;

  public blockPerLine: number;
  public linePerPage: number;
  public orientation: PaperOrientation;
  public lyricSize: number;

  constructor(
    public appService: AppService,
    public viewService: ViewService
  ) { }

  ngOnInit() {
    if (!this.loadLocalStorage()) {
      this.blockPerLine = DEFAULT_BLOCK_PER_LINE;
      this.linePerPage = DEFAULT_LINE_PER_PAGE;
      this.orientation = DEFAULT_ORIENTATION;
      this.lyricSize = DEFAULT_LYRIC_SIZE;
    }
  }

  public setOrientation(orientation: PaperOrientation) {
    this.orientation = orientation;
    this.viewService.setPrintStyle(this.orientation);
  }

  public print(): void {
    window.print();
    this.saveLocalStorage();
  }

  public saveLocalStorage(): void {
    localStorage.setItem('printSettings', JSON.stringify({
      blockPerLine: this.blockPerLine,
      linePerPage: this.linePerPage,
      orientation: this.orientation,
      lyricSize: this.lyricSize
    }));
  }

  public loadLocalStorage(): boolean {
    const json = localStorage.getItem('printSettings');
    if (!json) {
      return false;
    }
    const obj = JSON.parse(json);
    if (!obj) {
      return false;
    }

    this.blockPerLine = (obj.blockPerLine && obj.blockPerLine > 0) ? obj.blockPerLine : DEFAULT_BLOCK_PER_LINE;
    this.linePerPage = (obj.linePerPage && obj.linePerPage > 0) ? obj.linePerPage : DEFAULT_LINE_PER_PAGE;
    this.orientation = (obj.orientation) ? obj.orientation : DEFAULT_ORIENTATION;
    this.lyricSize = (obj.lyricSize && obj.lyricSize > 0) ? obj.lyricSize : DEFAULT_LYRIC_SIZE;

    return true;
  }

}
