import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Player } from '../domain/Player';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl: string = "http://localhost:8080/api";
  private authString: string | null = localStorage.getItem('authString');
  private headers: any = new HttpHeaders().set('Authorization', `Basic ${this.authString}`);

  constructor(private httpClient: HttpClient) { }

  public getPlayersByTeam(teamId: string): any {
    try {
      return this.httpClient.get<Player[]>(`${this.baseUrl}/players/bound/${teamId}`, { headers: this.headers });
    } catch (error) {
      console.log("Error fetching club's players: ", error);
    }
  }

  public getAllPlayers(currentPage: any, pageSize: any): Observable<Player[]> {
    if (!this.authString) {
      throw new Error('User not authenticated');
    }
    try {
      return this.httpClient.get<Player[]>(`${this.baseUrl}/players?page=${currentPage}&size=${pageSize}`, { headers: this.headers });
    } catch (error) {
      console.log("Error fetching players: ", error);
      throw (error);
    }
  }

  public searchPlayers(searchTerm: string, currentPage: any, pageSize: any): Observable<Player[]> {
    try {
      const params = new HttpParams()
        .set('searchTerm', searchTerm)
        .set('page', currentPage.toString())
        .set('size', pageSize.toString());
      return this.httpClient.get<Player[]>(`${this.baseUrl}/players/search`, { headers: this.headers, params: params });
    } catch (error) {
      console.log("Error searching players: ", error);
      throw (error);
    }
  }

  getPlayerDetails(playerId: string | null) {
    try {
      return this.httpClient.get<Player[]>(`${this.baseUrl}/players/${playerId}`, { headers: this.headers });
    } catch (error) {
      console.log("Error fetching player: ", error);
      throw (error);
    }
  }
}
