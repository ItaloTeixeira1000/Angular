import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form/login-form.component';
import { ButtonModule } from 'primeng/components/button/button';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';



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
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
     },
     AuthGuard,
     AuthService,
     JwtHelperService
  ]
})
export class SegurancaModule { }
