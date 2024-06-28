import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Player} from "../domain/Player";

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private baseUrl: string = "http://localhost:8080/api/predict";
  private authString: string | null = localStorage.getItem('authString');
  private headers: any = new HttpHeaders().set('Authorization', `Basic ${this.authString}`);

  constructor(private httpClient: HttpClient) { }

  public getSimilarPlayers(playerId: string, criteria: string): Observable<Player[]> {
    try {
      return this.httpClient.get<Player[]>(`${this.baseUrl}/player/similar/${criteria}/${playerId}`, { headers: this.headers });
    } catch (error) {
      console.log("Error fetching similar players: ", error);
      throw (error);
    }
  }

  predictMatchInTeam(playerID: string, teamID: string) {
    try {
      return this.httpClient.get<any>(`${this.baseUrl}/player/${playerID}/team/${teamID}`,
        { headers: this.headers });
    } catch (error) {
      console.log("Error while predicting fitness of player into team: ", error);
      throw (error);
    }
  }

  public getTeamMinMaxValues(teamId: any, fields: any){
    try{
      const params = new HttpParams().set('fieldNames', fields)
      return this.httpClient.get<any>(`${this.baseUrl}/team/details/${teamId}`, {headers: this.headers, params: params})
    }catch (error){
      console.log("Error getting min-max values ", error)
      throw (error);
    }
  }
}
