import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import localeFr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';
import { AppRoutingModule } from './app-routing.module';
import { LoginFormComponent } from './seguranca/login-form/login-form.component';
import { SegurancaModule } from './seguranca/seguranca.module';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TableModule,
    CoreModule,
    SegurancaModule,
    AppRoutingModule,
    ToastyModule.forRoot()
  ],
  providers: [
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
