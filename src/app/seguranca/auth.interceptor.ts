import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler, ): Observable<HttpEvent<any>> {

    let token = 'Bearer ' + localStorage.getItem('token');

    if (req.headers.get('Authorization') === 'Basic YW5ndWxhcjpAbmd1bEByMA==') {
      console.log('Entrou aqui');
      return next.handle(req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') }));
    } else {
      const dupReq = req.clone({ headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: token}) });
      return next.handle(dupReq);
    }



  }
}
