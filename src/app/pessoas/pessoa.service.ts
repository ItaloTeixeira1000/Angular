import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../core/model';



export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class PessoaService {

  pessoasUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams();
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    });

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasUrl}`, { headers,params })
      .toPromise()
      .then(response => {
        const responseJson = JSON.parse(JSON.stringify(response));
        const pessoas = responseJson.content;

        const resultado = {
          pessoas,
          total: responseJson.totalElements
        };

        return resultado;
      })
  }

  listarTodas(): Promise<any> {
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    });
    return this.http.get(this.pessoasUrl, { headers })
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)).content);
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    });
    return this.http.delete(`${this.pessoasUrl}/${codigo}`, { headers })
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void>{
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==',
        'Content-Type': 'application/json'
    });

    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`,ativo, {headers})
    .toPromise()
    .then(() => null)
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa>{
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==',
        'Content-Type': 'application/json'
    });

    return this.http.post(this.pessoasUrl, JSON.stringify(pessoa), { headers })
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)))
  }

}
