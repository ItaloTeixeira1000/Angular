import { PessoaService } from './pessoa.service';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';

import { SharedModule } from './../shared/shared.module';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,

    SharedModule
  ],
  declarations: [
    PessoaCadastroComponent,
    PessoasPesquisaComponent
  ],
  exports: [
    PessoaCadastroComponent,
    PessoasPesquisaComponent
  ]
})
export class PessoasModule { }
