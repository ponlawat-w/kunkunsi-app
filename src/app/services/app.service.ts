import { Injectable } from '@angular/core';
import { LayoutAlignment } from '../enums/layout-alignment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private layout: LayoutAlignment;

  constructor() {
    this.setLayout(LayoutAlignment.Vertical);
  }

  public isVertical(): boolean {
    return this.layout === LayoutAlignment.Vertical;
  }

  public isHorizontal(): boolean {
    return this.layout === LayoutAlignment.Horizontal;
  }

  public setLayout(layout: LayoutAlignment): void {
    this.layout = layout;
    if (this.layout === LayoutAlignment.Vertical) {
      document.body.classList.add('vertical');
    } else {
      document.body.classList.remove('vertical');
    }
  }
}
