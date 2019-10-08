import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form/login-form.component';
import { ButtonModule } from 'primeng/components/button/button';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    SegurancaRoutingModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    HttpClientModule
  ],
  exports: [
    
  ]
})
export class SegurancaModule { }
