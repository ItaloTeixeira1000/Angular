import { AuthService } from './../../seguranca/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private handle: ErrorHandlerService
    ) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout()
      .then( () => {
        this.router.navigate(['/login']);
      } )
      .catch(erro => {
        this.handle.handle(erro);
      })
  }
  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken();
  }

}
