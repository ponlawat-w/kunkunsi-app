import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { LayoutAlignment } from '../../enums/layout-alignment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit() {
  }

  public setVertical(): void {
    this.appService.setLayout(LayoutAlignment.Vertical);
  }

  public setHorizontal(): void {
    this.appService.setLayout(LayoutAlignment.Horizontal);
  }

}
