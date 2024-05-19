import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Player} from "../domain/Player"; // Make sure to import SimilarPlayerDTOAPI or adjust the import path

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private username: string = 'test';
  private password: string = 'test';
  private baseUrl: string = "http://localhost:8080/api/predict";
  private authString: string = btoa(`${this.username}:${this.password}`);
  private headers: any = new HttpHeaders().set('Authorization', `Basic ${this.authString}`);

  constructor(private httpClient: HttpClient) { }

  public getSimilarPlayers(playerId: string): Observable<Player[]> {
    try {
      return this.httpClient.get<Player[]>(`${this.baseUrl}/player/similar/${playerId}`, { headers: this.headers });
    } catch (error) {
      console.log("Error fetching similar players: ", error);
      throw (error);
    }
  }

  predictMatchInTeam(playerID: string, teamID: string) {
    try {
      return this.httpClient.get<any>(`${this.baseUrl}/player/${playerID}/team/${teamID}`, { headers: this.headers });
    } catch (error) {
      console.log("Error while predicting fitness of player into team: ", error);
      throw (error);
    }
  }
}
