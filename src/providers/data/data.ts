import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  headers = new Headers({ 'user-key': 'a8a0734b8f428e708e1cd87f805bfc82' });
  options = new RequestOptions({ headers: this.headers });
  limit:number = 50;

  constructor(public http: Http) {
    console.log('Hello DataProvider Provider');
  }

  getGames(genre, offset_num) {
    let genre_id = genre;
    let offset = offset_num;

    return this.http.get('http://localhost:8080/https://api-2445582011268.apicast.io/games/?fields=name,release_dates,screenshots&limit='+this.limit+'&offset='+offset+'&order=release_dates.date:desc&filter[genres][eq]='+genre_id+'&filter[screenshots][exists]', this.options)
      .map(response => response.json());
  }

  getFavorites(favs) {

    let favorites = favs;
    favorites = favorites.join();

    return this.http.get('http://localhost:8080/https://api-2445582011268.apicast.io/games/'+favorites+'?fields=name,release_dates,screenshots&order=release_dates.date:desc&filter[screenshots][exists]', this.options)
      .map(response => response.json());

  }

  getGenres() {
    return this.http.get('http://localhost:8080/https://api-2445582011268.apicast.io/genres/?fields=*', this.options)
      .map(response => response.json());
  }

  searchGames(keyword) {
    return this.http.get('http://localhost:8080/https://api-2445582011268.apicast.io/games/?fields=name,release_dates,screenshots&limit='+this.limit+'&offset=0&order=release_dates.date:desc&search='+keyword, this.options)
      .map(response => response.json());
  }

  getGame(game) {
    let game_id = game;

    return this.http.get('http://localhost:8080/https://api-2445582011268.apicast.io/games/'+game_id+'?fields=*', this.options)
      .map(response => response.json());
  }

  getPerspective(perspective) {
    let persp_id = perspective;

    return this.http.get('http://localhost:8080/https://api-2445582011268.apicast.io/player_perspectives/'+persp_id+'?fields=name', this.options)
      .map(response => response.json());
  }

}
