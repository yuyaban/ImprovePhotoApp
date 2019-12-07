import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileApiService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions: any = {
    // ヘッダ情報
    headers: new HttpHeaders({
      'Content-Type': 'image/png',
      // tslint:disable-next-line: object-literal-key-quotes
      'Accept': 'image/png'
    }),
  };

  postImage(image: File): Observable<Blob> {
    console.log(image);
    return this.http.post<Blob>('https://jfn6kurzw6.execute-api.us-east-2.amazonaws.com/prod',
    image, {headers: this.httpOptions, responseType: 'blob' as 'json' });
  }
}
