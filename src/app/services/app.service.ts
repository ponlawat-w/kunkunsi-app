import { Injectable } from '@angular/core';
import { LayoutAlignment } from '../enums/layout-alignment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private layout: LayoutAlignment;

  constructor() {
    const layout = parseInt(localStorage.getItem('layout'), 10);
    if (layout) {
      this.setLayout(layout);
    } else {
      this.setLayout(LayoutAlignment.Vertical);
    }
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
    localStorage.setItem('layout', layout.toString());
    if (this.layout === LayoutAlignment.Vertical) {
      document.body.classList.add('vertical');
      document.body.classList.remove('horizontal');
    } else if (this.layout === LayoutAlignment.Horizontal) {
      document.body.classList.remove('vertical');
      document.body.classList.add('horizontal');
    }
  }
}
