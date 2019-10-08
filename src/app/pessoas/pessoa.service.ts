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

  headers = new HttpHeaders({
    Authorization:
      // tslint:disable-next-line: max-line-length
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbkBhbGdhbW9uZXkuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIiwicHV0Il0sIm5vbWUiOiJBZG1pbmlzdHJhZG9yIiwiZXhwIjoxNTcwNTU0MjQyLCJhdXRob3JpdGllcyI6WyJST0xFX0NBREFTVFJBUl9DQVRFR09SSUEiLCJST0xFX1BFU1FVSVNBUl9QRVNTT0EiLCJST0xFX1JFTU9WRVJfUEVTU09BIiwiUk9MRV9DQURBU1RSQVJfTEFOQ0FNRU5UTyIsIlJPTEVfUEVTUVVJU0FSX0xBTkNBTUVOVE8iLCJST0xFX1JFTU9WRVJfTEFOQ0FNRU5UTyIsIlJPTEVfQ0FEQVNUUkFSX1BFU1NPQSIsIlJPTEVfUEVTUVVJU0FSX0NBVEVHT1JJQSIsIlJPTEVfQVRVQUxJWkFSX1BFU1NPQSJdLCJqdGkiOiI0YmVhODdiYy1iYzI2LTQxNDktOThiMC04MGYxNDZiMjQwMTciLCJjbGllbnRfaWQiOiJhbmd1bGFyIn0.X5j09T802A2BNiv277z7v0qWhR9tLYHIAub19NxFVqY',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  pesquisar(filtro: PessoaFiltro, cidade: string, estado: string, ativo: string): Promise<any> {
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
    return this.http.get(`${this.pessoasUrl}`, { headers: this.headers, params })
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
    return this.http.get(this.pessoasUrl, { headers: this.headers })
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)).content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`, { headers: this.headers })
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {

    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers: this.headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {

    return this.http.post(this.pessoasUrl, JSON.stringify(pessoa), { headers: this.headers })
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get(`${this.pessoasUrl}/${codigo}`, { headers: this.headers })
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {

    return this.http.put(`${this.pessoasUrl}/${pessoa.codigo}`, JSON.stringify(pessoa), { headers: this.headers })
      .toPromise()
      .then(pessoaSalva => JSON.parse(JSON.stringify(pessoaSalva)));
  }

}
