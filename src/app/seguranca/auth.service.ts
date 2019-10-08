import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelper
    ) { }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders({
      'Authorization' : 'Basic YW5ndWxhcjpAbmd1bEByMA==',
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    const body =  `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers })
      .toPromise()
      .then(response => {
        console.log(response);
      })
      .catch(response => {
        console.log(response);
      });

  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token); 
  }
}
