import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BodyComponent } from './body.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TitleComponent } from './components/title/title.component';
import { EditorComponent } from './components/editor/editor.component';
import { BlockComponent } from './components/block/block.component';
import { LyricEditComponent } from './components/block/lyric-edit/lyric-edit.component';
import { PrintVerticalComponent } from './components/print/print-vertical/print-vertical.component';
import { PrintHorizontalComponent } from './components/print/print-horizontal/print-horizontal.component';
import { PrintComponent } from './components/print/print.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BodyComponent,
    TitleComponent,
    EditorComponent,
    BlockComponent,
    LyricEditComponent,
    PrintVerticalComponent,
    PrintHorizontalComponent,
    PrintComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
