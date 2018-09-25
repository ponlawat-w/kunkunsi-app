import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { DescriptionComponent } from './components/description/description.component';
import { AdditionalLyricsComponent } from './components/additional-lyrics/additional-lyrics.component';
import { GithubImporterComponent } from './components/github-importer/github-importer.component';

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
    PrintComponent,
    DescriptionComponent,
    AdditionalLyricsComponent,
    GithubImporterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
