import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthDataModel } from '../model/auth-data.model';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiURL + '/user/' ;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthDataModel= {email: email, password: password};
    this.http.post(BACKEND_URL + "signup", authData).subscribe(() => {
      this.router.navigate(["/login"]);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  loginUser(email: string, password: string){
    const authData: AuthDataModel= {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "login", authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if(token) {
        const expiresInDuration = response.expiresIn;
        this.serAuthTimer(expiresInDuration);       
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        console.log(now);
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expiresInDuration);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
    console.log('connectit');
  }

  autoAuthUser() {
    const authInfo = this.getAuthData() ;
    if(!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime() ;
    if(expiresIn > 0) {
      this.token = authInfo.token;
      this.serAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.router.navigate(['/login']);
  }

  private serAuthTimer(duration: number) {
    console.log('Setting timer: ', duration);
    
    this.tokenTimer = setTimeout(() => {
      this.logout
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);

  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate ) {
      return;
    }
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
      }
  }
}
