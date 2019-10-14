import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { Lancamento } from '../core/model';
import { AuthService } from '../seguranca/auth.service';
import { environment } from 'src/environments/environment';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class LancamentoService {

  lancamentosUrl : string;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { 
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  pesquisar(filtro: LancamentoFiltro, pessoa: string, valor: number, dataPagamento: Date): Promise<any> {
    if (this.auth.isAccessTokenInvaldo) {
      this.auth.obterNovoAccessToken().then(() => {
        if (filtro.descricao == null) {
          filtro.descricao = '';
        }
        if (pessoa == null) {
          pessoa = '';
        }

      })

    }
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
      { params })
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
    this.atualizarToken();

    return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    this.atualizarToken();

    return this.http.post(this.lancamentosUrl,
      JSON.stringify(lancamento))
      .toPromise()
      .then(response => JSON.parse(JSON.stringify(response)));
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    this.atualizarToken();

    return this.http.put(`${this.lancamentosUrl}/${lancamento.codigo}`,
      JSON.stringify(lancamento))
      .toPromise()
      .then(response => {
        const lancamentoAlterado = JSON.parse(JSON.stringify(response)) as Lancamento;

        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    this.atualizarToken();
    return this.http.get(`${this.lancamentosUrl}/${codigo}`)
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

  atualizarToken() {
    if (this.auth.isAccessTokenInvaldo) {
      this.auth.obterNovoAccessToken();
    }
  }


}
