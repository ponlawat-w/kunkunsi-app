import { Component, OnInit } from '@angular/core';
import { AppService } from './services/app.service';
import { ViewService } from './services/view.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  constructor(
    public viewService: ViewService,
    public appService: AppService) { }

  ngOnInit() {
  }

  onWheel(event: WheelEvent) {
    if (!this.appService.isVertical() || !event.deltaY) {
      return;
    }

    const deltaY = event.deltaY;
    const sign = deltaY / Math.abs(deltaY);
    this.viewService.bodyElement.scrollLeft -= sign * 100;
  }

}
