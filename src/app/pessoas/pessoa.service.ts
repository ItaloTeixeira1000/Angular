import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../core/model';
import { AuthService } from '../seguranca/auth.service';
import { environment } from 'src/environments/environment';



export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class PessoaService {

  pessoasUrl : string;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { 
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
  }

  pesquisar(filtro: PessoaFiltro, cidade: string, estado: string, ativo: string): Promise<any> {
    this.atualizarToken();
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    if (cidade) {
      params = params.set('cidade', cidade);
    }

    if (estado) {
      params = params.set('estado', estado);
    }

    if (ativo) {
      params = params.set('ativo', ativo);
    }
    return this.http.get(`${this.pessoasUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = JSON.parse(JSON.stringify(response));
        const pessoas = responseJson.content;

        const resultado = {
          pessoas,
          total: responseJson.totalElements
        };
        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    this.atualizarToken();
    return this.http.get(this.pessoasUrl)
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)).content);
  }

  excluir(codigo: number): Promise<void> {
    this.atualizarToken();
    return this.http.delete(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    this.atualizarToken();

    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo)
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    this.atualizarToken();

    return this.http.post(this.pessoasUrl, JSON.stringify(pessoa))
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    this.atualizarToken();
    return this.http.get(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    this.atualizarToken();

    return this.http.put(`${this.pessoasUrl}/${pessoa.codigo}`, JSON.stringify(pessoa))
      .toPromise()
      .then(pessoaSalva => JSON.parse(JSON.stringify(pessoaSalva)));
  }

  atualizarToken() {
    if (this.auth.isAccessTokenInvaldo) {
      this.auth.obterNovoAccessToken();
    }
  }

}
