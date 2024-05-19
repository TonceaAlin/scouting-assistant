import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Player } from '../domain/Player';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private username: string = 'test';
  private password: string = 'test';
  private baseUrl: string = "http://localhost:8080/api";
  private authString: string = btoa(`${this.username}:${this.password}`);
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
}
