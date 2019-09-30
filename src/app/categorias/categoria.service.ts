import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService implements OnInit {

   categoriaUrl = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.listarTodas();
  }

  listarTodas(): Promise<any>{
    const headers = new HttpHeaders({
      Authorization:
        // tslint:disable-next-line: max-line-length
        'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    });

    return this.http.get(`${this.categoriaUrl}`, {headers})
      .toPromise()
      .then( response => JSON.parse(JSON.stringify(response)) );
  }
}
