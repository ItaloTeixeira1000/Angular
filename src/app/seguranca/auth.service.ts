
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';




const auth = new JwtHelperService();
export class NotLoggedIn {}
@Injectable({
  providedIn: 'root'
})


export class AuthService {

  oauthTokenUrl : string;
  jwtPayload: any;
  obj: any;
  logoutPath : string

  constructor(
    private http: HttpClient
  ) {
    this.carregarToken();
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.logoutPath = `${environment.apiUrl}/tokens/revoke`;
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders({
      Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA==',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(JSON.parse(JSON.stringify(response)).access_token);
      })
      .catch(response => {
        const responseJson = JSON.parse(JSON.stringify(response));
        if (responseJson.status === 400) {
          if (responseJson.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }
        return Promise.reject(response);
      });

  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders({
      Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA==',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = 'grant_type=refresh_token';
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(JSON.parse(JSON.stringify(response)).access_token);
        console.log('Novo access token criado');
        if(this.isAccessTokenInvaldo()){
          throw new NotLoggedIn();
        }
        return Promise.resolve(null);
      })
      .catch(response => {

        console.log('Erro ao renovar token. ', response);
        return Promise.resolve(null);
      });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  logout(){

    return this.http.delete(this.logoutPath, {withCredentials: true})
    .toPromise()
    .then(() => {
         this.limparAccessToken();
    });
}

  isAccessTokenInvaldo() {
    const token = localStorage.getItem('token');

    return !token || auth.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: any) {
    this.jwtPayload = auth.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }
}

