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

  public get layoutAlignment(): LayoutAlignment {
    return this.layout;
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
      document.body.classList.remove('horizontal');
    } else {
      document.body.classList.remove('vertical');
      document.body.classList.add('horizontal');
    }
  }
}
