import { Component, OnInit, ViewChild, Input, AfterContentChecked } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaFiltro, PessoaService } from './../pessoa.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  display: boolean = false;

  @ViewChild('tabela', { static: false }) grid;
  @Input() cidade;
  @Input() estado;
  @Input() ativo;

  constructor(
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private title: Title
  ) { }

  ngOnInit() {
    this.pessoaService.atualizarToken();
    this.title.setTitle('Pesquisa de Pessoas');
  }

  showDialog() {
    this.display = true;
  }

  hiddenDialog() {
    this.display = false;
  }
  limparTudo() {
    this.cidade = '';
    this.estado = '';
    this.ativo = '';
  }
  cancelar() {
    this.limparTudo();
    this.hiddenDialog();
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro, this.cidade, this.estado, this.ativo)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHandler.handle(erro));

  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {

        this.pesquisar(this.cidade);

        this.grid.first = 0;


        this.toasty.success('Pesssoa excluída com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  mudarStatus(pessoa: any) {

    const status = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, status)
      .then(() => {
        this.pesquisar();

        this.grid.first = 0;

        if (status) {
          this.toasty.success('Pessoa ativada com sucesso!');
        } else {
          this.toasty.success('Pessoa desativada com sucesso!');
        }

      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
