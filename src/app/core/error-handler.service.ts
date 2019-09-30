import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ToastyService } from 'ng2-toasty';

@Injectable()
export class ErrorHandlerService {

  constructor(private toasty: ToastyService) { }

  handle(errorResponse: any) {
    let msg: string;
    let erroJson = JSON.parse(JSON.stringify(errorResponse));
    if (typeof errorResponse === 'string') {
      msg = errorResponse;

    } else if (errorResponse instanceof HttpResponse
        && erroJson.status >= 400 && erroJson.status <= 499) {
      let errors;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

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
