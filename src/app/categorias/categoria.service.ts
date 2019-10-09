import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../seguranca/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService implements OnInit {

  categoriaUrl = 'http://localhost:8080/categorias';

  constructor(
    private http: HttpClient,
    private auth: AuthService
    ) { }

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
