import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Team} from "../domain/Team";

@Injectable({
  providedIn: 'root'
})
export class TeamService {


  private baseUrl: string = "http://localhost:8080/api";
  private authString: string | null = localStorage.getItem('authString');
  private headers: any = new HttpHeaders().set('Authorization', `Basic ${this.authString}`);

  constructor(private httpClient: HttpClient) { }

  getTeamsByLeague(leagueId: string) {
    try{
      return this.httpClient.get<Team[]>(`${this.baseUrl}/teams/bound/${leagueId}`, { headers: this.headers })
    }catch(error){
      console.log("Error while fetching teams for a certain league ", error);
      throw(error);
    }
  }
}
