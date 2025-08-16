import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  
   baseUrl = environment?.baseUrl;
  
    constructor(private http: HttpClient, private router: Router,) {

    }


   public sendGetRequest(apiURL:any, queryParams:any){
   console.log("@sendGetRequest");
  return this.http.get(apiURL, {params: queryParams});

  }

  getWithToken(url: string, params?: any) {
    const headers = this.getHeaders();
   return this.http.get<any>(url, { headers, params }).pipe(retry(3));
  }

  // Existing method (for reference)
  getMenu() {
    return this.getWithToken('http://localhost:8000/base/permittedModule/getMenu');
  }


 public sendPostPutReq<T>(apiURL:any, data: any,method:any): Observable<T>{
  const headers = this.getHeaders();
if(method.toString()==='post'){
  return this.http.post<T>(apiURL, data, { headers });
}
else if(method.toString()==='put'){
  return this.http.put<T>(apiURL, data, { headers });
}
else if(method.toString()==='patch'){
  return this.http.patch<T>(apiURL, data, { headers });
}
else{
  return this.http.patch<T>(apiURL, data, { headers });
}
 }


  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('jwtToken');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }


  public sendDeleteRequest(apiURL:any, formData:any){
    console.log("@sendDeleteRequest");
    return this.http.delete(apiURL, formData);

  }

}
