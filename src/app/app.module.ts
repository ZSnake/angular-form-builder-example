import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialDesignFrameworkModule } from 'angular6-json-schema-form';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialDesignFrameworkModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
