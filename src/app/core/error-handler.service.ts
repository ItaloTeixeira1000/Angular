
import { Injectable } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService, NotLoggedIn } from '../seguranca/auth.service';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private toasty: ToastyService,
    private auth: AuthService,
    private router: Router
  ) { }

  handle(errorResponse: any) {
    if (this.auth.isAccessTokenInvaldo) {
      this.auth.obterNovoAccessToken();
    }
    let msg: string;
    let erroJson = JSON.parse(JSON.stringify(errorResponse));

    if (typeof errorResponse === 'string') {
      msg = errorResponse;

    } else if (errorResponse instanceof NotLoggedIn) {
      msg = 'Sua sessão expirou';
      console.error(msg)
      this.router.navigate(['/login']);
    } else if (erroJson.status >= 400 && erroJson.status <= 499) {
      let errors;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (erroJson.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        errors = JSON.parse(JSON.stringify(errorResponse));
        msg = erroJson.error[0].mensagemUsuario;
      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);

    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    this.toasty.error(msg);

  }

}
