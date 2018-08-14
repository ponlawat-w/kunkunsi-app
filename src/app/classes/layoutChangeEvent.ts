import { ViewService } from '../services/view.service';
import { LayoutAlignment } from '../enums/layout-alignment';

export class LayoutChangeEvent {
    public viewService: ViewService;
    public layout: LayoutAlignment;

    constructor(vS: ViewService, l: LayoutAlignment) {
        this.viewService = vS;
        this.layout = l;
    }
}
