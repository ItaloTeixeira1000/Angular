import { AuthService } from 'src/app/seguranca/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.isAccessTokenInvaldo()) {
      console.log('Navegação com access token inválido. Redirecionando para o login');

      return this.auth.obterNovoAccessToken()
        .then(() => {
          if (this.auth.isAccessTokenInvaldo()) {
            this.router.navigate(['/login']);
            return false;
          }
        })
        

    } else if (next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {
      this.router.navigate(['/nao-autorizado']);
      return false;
    }

    return true;
  }

}
