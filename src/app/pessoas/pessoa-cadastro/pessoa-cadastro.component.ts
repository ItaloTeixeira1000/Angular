import { Component, OnInit } from '@angular/core';
import { Pessoa } from 'src/app/core/model';
import { FormControl } from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  constructor(
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService
    ) { }

  ngOnInit() {
 
  }

  pessoas = new Pessoa();

  salvar(form: FormControl){
    this.pessoaService.adicionar(this.pessoas)
      .then(() => {
        this.toasty.success('Pessoa adicinada com sucesso');

        form.reset();
        this.pessoas = new Pessoa();
      })
      .catch(erro => this.errorHandler.handle(erro) );
  }

}
