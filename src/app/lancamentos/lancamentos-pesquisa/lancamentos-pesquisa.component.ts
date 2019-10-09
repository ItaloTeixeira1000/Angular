import { Component, OnInit, ViewChild, Input, AfterContentChecked } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  @Input() pessoa;
  @Input() valor;
  @Input() dataPagamento;
  lancamentos = [];
  display: boolean = false;
  @ViewChild('tabela', { static: false }) grid;



  constructor(
    private lancamentoService: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private toasty: ToastyService,
    private confirmation: ConfirmationService,
    private title: Title,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.lancamentoService.atualizarToken()
    this.title.setTitle('Pesquisa de Lançamentos');
  }

  showDialog() {
    this.display = true;
  }

  hiddenDialog() {
    this.display = false;
  }
  limparTudo() {
    this.pessoa = '';
    this.valor = '';
    this.dataPagamento = '';
  }
  cancelar() {
    this.limparTudo();
    this.hiddenDialog();
  }


  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;


    this.lancamentoService.pesquisar(this.filtro, this.pessoa, this.valor, this.dataPagamento)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
        this.pesquisar();
      }
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar();

        this.toasty.success('Lançamento excluído com sucesso!');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
