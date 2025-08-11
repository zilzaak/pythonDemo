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
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log(url)
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    console.log(headers)

    return this.http.get<any>(url, { headers, params }).pipe(retry(3));
  }

  // Existing method (for reference)
  getMenu() {
    return this.getWithToken('http://localhost:8000/base/permittedModule/getMenu');
  }

  public sendPostRequest(apiURL:any, formData:any)
  {
    console.log("@sendPostRequest");
    return this.http.post(apiURL, formData);
  }
 
  public sendPutRequest(apiURL:any,formData:any){

    console.log("@sendPutRequest");
    return this.http.put(apiURL,formData);

  }


  public sendDeleteRequest(apiURL:any, formData:any){

    console.log("@sendDeleteRequest");
    return this.http.delete(apiURL, formData);

  }

}
