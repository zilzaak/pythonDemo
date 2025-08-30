import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  baseUrl = environment?.baseUrl;
  private userData:any={
    menuList:[],
    orgList:[]
  };
  dataLoaded:boolean=false;
  private key: any;

  constructor(private http: HttpClient, private router: Router,) { }

  public generateToken(loginData: any) {
    return this.http.post('http://localhost:8000/auth/getToken', loginData);
  }

  public getMenu(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>('http://localhost:8000/base/permittedModule/getMenu', { headers })
      .pipe(retry(3));
  }


  async userInfo() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData = JSON.parse(storedData);
      this.dataLoaded = true;
      return this.userData;
    }else{
      try {
        const menus: any = await this.getMenu().toPromise();
        this.userData = {
          menuList: menus.data.menus,
          orgList: menus.data.orgs
        };      
        this.dataLoaded = true;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        return this.userData;   
      } catch (err) {
        return this.userData;
      }
    }
  }


  sendPostRequest(apiURL: string, user: any): Observable<any> {
    return this.http.post<any>(apiURL, user);
  }

  sendPutRequest(apiURL: string, user: any): Observable<any> {
    return this.http.put<any>(apiURL, user);
  }

  public sendGetRequest(apiURL: string, queryParams: any) {
    return this.http.get<any>(apiURL, { params: queryParams }).pipe(retry(3));
  }


  public saveToken(token: string): void {
    localStorage.setItem('jwtToken', token); 
  }

  public getToken(): string | null {
    return localStorage.getItem('jwtToken'); 
  }


  public clearToken(): void {
    localStorage.removeItem('jwtToken'); 
  }

}
