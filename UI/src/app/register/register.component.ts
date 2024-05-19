import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  role: string = 'USER'; // default role, or you can make it dynamic
  private baseUrl: string = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient, private router: Router) { }

  onSubmit() {
    const user = { username: this.username, password: this.password, role: this.role };
    this.httpClient.post(`${this.baseUrl}/register`, user, {responseType: "text"})
      .subscribe(
        response => {
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration failed', error);
        }
      );
  }
}
