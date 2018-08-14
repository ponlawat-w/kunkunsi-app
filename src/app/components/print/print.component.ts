import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  public blockPerLine: number;
  public linePerPage: number;

  constructor(public appService: AppService) { }

  ngOnInit() {
    if (!this.loadLocalStorage()) {
      this.blockPerLine = 9;
      this.linePerPage = 11;
    }
  }

  public print(): void {
    window.print();
    this.saveLocalStorage();
  }

  public saveLocalStorage(): void {
    localStorage.setItem('printSettings', JSON.stringify({
      blockPerLine: this.blockPerLine,
      linePerPage: this.linePerPage
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

    if (obj.blockPerLine > 0 && obj.linePerPage > 0) {
      this.blockPerLine = obj.blockPerLine;
      this.linePerPage = obj.linePerPage;
      return true;
    }
    return false;
  }

}
