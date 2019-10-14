import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { LancamentosModule } from './lancamentos/lancamentos.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { SegurancaModule } from './seguranca/seguranca.module';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';
import { LoginFormComponent } from './seguranca/login-form/login-form.component';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component:LoginFormComponent},
  {path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent},
  {path: 'nao-autorizado', component: NaoAutorizadoComponent},
  {path: '**', redirectTo: 'pagina-nao-encontrada'}

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LancamentosModule,
    PessoasModule,
    SegurancaModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
