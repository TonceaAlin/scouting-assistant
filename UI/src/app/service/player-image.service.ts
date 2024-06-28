import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerImageService {

  constructor() { }
  getPlayerImageUrl(playerId: string | null): string {
    const playerIdSegment1 = playerId?.slice(0, 3);
    const playerIdSegment2 = playerId?.slice(3, 6);
    return `https://cdn.sofifa.net/players/${playerIdSegment1}/${playerIdSegment2}/24_120.png`;
  }
  getPlayerFlagUrl(nationality: string | null){
    const nationalitySegment = nationality?.slice(0, 2).toLowerCase();
    return `https://cdn.sofifa.net/flags/${nationalitySegment}.png`;
  }
}
