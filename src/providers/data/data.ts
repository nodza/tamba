import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
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

  constructor(public http: HttpClient) {
    console.log('Hello DataProvider Provider');
  }

  getGames(genre, offset_num) {
    let genre_id = genre;
    let offset = offset_num;

    return this.http.get('https://api-2445582011268.apicast.io/games/?fields=name,release_dates,screenshots&limit='+this.limit+'&offset='+offset+'&order=release_dates.date:desc&filter[genres][eq]='+genre_id+'&filter[screenshots][exists]', this.options)
      .map(response => response.json());
  }

}
