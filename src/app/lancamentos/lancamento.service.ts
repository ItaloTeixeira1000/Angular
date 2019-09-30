import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { Lancamento } from '../core/model';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class LancamentoService {

  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient) { }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams();
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    });

    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`,
        { headers, params })
      .toPromise()
      .then(response => {
        const responseJson = JSON.parse(JSON.stringify(response));;
        const lancamentos = responseJson.content;

        const resultado = {
          lancamentos,
          total: responseJson.totalElements
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    });
    
    return this.http.delete(`${this.lancamentosUrl}/${codigo}`, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento>{
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==',
        'Content-Type': 'application/json'
    });

    return this.http.post(this.lancamentosUrl,
      JSON.stringify(lancamento), { headers })
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

}
