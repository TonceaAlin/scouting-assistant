import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(): boolean {
    const authString = localStorage.getItem('authString');
    return !!authString;
  }

  login(username: string, password: string): void {
    const authString = btoa(`${username}:${password}`);
    localStorage.setItem('authString', authString);
    localStorage.setItem('username', username); // Save username
  }

  logout(): void {
    localStorage.removeItem('authString');
    localStorage.removeItem('username');
  }

  getUsername(): string | null {
    return localStorage.getItem('username'); // Retrieve username
  }
}
