import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  private baseUrl: string = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient, private router: Router) { }

  onSubmit() {
    const authString = btoa(`${this.username}:${this.password}`);
    const headers = new HttpHeaders().set('Authorization', `Basic ${authString}`);

    this.httpClient.post(`${this.baseUrl}/login`, {}, { headers: headers, responseType: 'text' })
      .subscribe(
        response => {
          localStorage.setItem('authString', authString);
          this.router.navigate(['/home']); // Replace with your protected route
        },
        error => {
          console.error('Login failed', error);
        }
      );
  }

  navigateToRegister() {
    this.router.navigate(['/register'])
  }
}
