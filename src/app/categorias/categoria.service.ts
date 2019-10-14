import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../seguranca/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService implements OnInit {

  categoriaUrl : string;

  constructor(
    private http: HttpClient,
    private auth: AuthService
    ) { 
      this.categoriaUrl = `${environment.apiUrl}/categorias`
    }

  // tslint:disable-next-line: contextual-lifecycle
  ngOnInit() {
    this.listarTodas();
  }

  listarTodas(): Promise<any> {
    this.atualizarToken();


    return this.http.get(`${this.categoriaUrl}`)
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

  atualizarToken() {
    if (this.auth.isAccessTokenInvaldo) {
      this.auth.obterNovoAccessToken();
    }
  }
}
