import { Injectable } from '@angular/core';
import {League} from "../domain/League";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  private baseUrl: string = "http://localhost:8080/api";
  private authString: string | null = localStorage.getItem('authString');
  private headers: any = new HttpHeaders().set('Authorization', `Basic ${this.authString}`);

  constructor(private httpClient: HttpClient) { }

  getAllLeagues(): Observable<League[]>{
    try{
      return this.httpClient.get<League[]>(`${this.baseUrl}/leagues`, { headers: this.headers });
    }catch (e) {
      console.log("Error while fetching leagues ", e);
      throw(e);
    }
  }
}
