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
  headers = new HttpHeaders({
    Authorization:
      // tslint:disable-next-line: max-line-length
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbkBhbGdhbW9uZXkuY29tIiwic2NvcGUiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIiwicHV0Il0sIm5vbWUiOiJBZG1pbmlzdHJhZG9yIiwiZXhwIjoxNTcwNTU0MjQyLCJhdXRob3JpdGllcyI6WyJST0xFX0NBREFTVFJBUl9DQVRFR09SSUEiLCJST0xFX1BFU1FVSVNBUl9QRVNTT0EiLCJST0xFX1JFTU9WRVJfUEVTU09BIiwiUk9MRV9DQURBU1RSQVJfTEFOQ0FNRU5UTyIsIlJPTEVfUEVTUVVJU0FSX0xBTkNBTUVOVE8iLCJST0xFX1JFTU9WRVJfTEFOQ0FNRU5UTyIsIlJPTEVfQ0FEQVNUUkFSX1BFU1NPQSIsIlJPTEVfUEVTUVVJU0FSX0NBVEVHT1JJQSIsIlJPTEVfQVRVQUxJWkFSX1BFU1NPQSJdLCJqdGkiOiI0YmVhODdiYy1iYzI2LTQxNDktOThiMC04MGYxNDZiMjQwMTciLCJjbGllbnRfaWQiOiJhbmd1bGFyIn0.X5j09T802A2BNiv277z7v0qWhR9tLYHIAub19NxFVqY',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  pesquisar(filtro: LancamentoFiltro, pessoa: string, valor: number, dataPagamento: Date): Promise<any> {
    let params = new HttpParams();
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

    if (pessoa) {
      params = params.set('pessoa', pessoa);
    }

    if (valor) {
      params = params.set('valor', valor.toString());
    }

    if (dataPagamento) {
      params = params.set('dataPagamento',
        moment(dataPagamento).format('YYYY-MM-DD'));
    }


    return this.http.get(`${this.lancamentosUrl}?resumo`,
      { headers: this.headers, params })
      .toPromise()
      .then(response => {
        const responseJson = JSON.parse(JSON.stringify(response));
        const lancamentos = responseJson.content;

        const resultado = {
          lancamentos,
          total: responseJson.totalElements
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {

    return this.http.delete(`${this.lancamentosUrl}/${codigo}`, { headers: this.headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {

    return this.http.post(this.lancamentosUrl,
      JSON.stringify(lancamento), { headers: this.headers })
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {

    return this.http.put(`${this.lancamentosUrl}/${lancamento.codigo}`,
      JSON.stringify(lancamento), { headers: this.headers })
      .toPromise()
      .then(response => {
        const lancamentoAlterado = JSON.parse(JSON.stringify(response)) as Lancamento;

        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    return this.http.get(`${this.lancamentosUrl}/${codigo}`, { headers: this.headers })
      .toPromise()
      .then(response => {
        const lancamento = JSON.parse(JSON.stringify(response)) as Lancamento;

        this.converterStringsParaDatas([lancamento]);

        return lancamento;
      });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }
    }
  }


}
