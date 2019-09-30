import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { LancamentosModule } from './lancamentos/lancamentos.module';
import localeFr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';

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
    LancamentosModule,
    PessoasModule,
    ToastyModule.forRoot()
  ],
  providers: [
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
