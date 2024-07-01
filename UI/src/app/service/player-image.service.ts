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
    let nationalitySegment = nationality?.slice(0, 2).toLowerCase();
    if(nationality === "Germany"){
      nationalitySegment = 'de';
    }else if(nationality === "England"){
      nationalitySegment = 'gb-eng';
    }else if(nationality === "Poland"){
      nationalitySegment = 'pl';
    }else if(nationality === "Portugal"){
      nationalitySegment = 'pt';
    }else if(nationality === "Switzerland"){
      nationalitySegment = 'ch';
    }else if(nationality === "Uruguay"){
      nationalitySegment = 'uy';
    }
    return `https://cdn.sofifa.net/flags/${nationalitySegment}.png`;
  }
}
