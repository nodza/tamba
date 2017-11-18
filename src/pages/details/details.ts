import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  game_id: number;
  game: object;
  perspective: object;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _data: DataProvider) {

    this.game_id = navParams.get("game");

  }

  ionViewDidLoad() {
    this._data.getGame(this.game_id)
      .subscribe(res => {

        this._data.getPerspective(res[0].player_perspectives[0])
          .subscribe(res => this.perspective = res[0]);

        this.game = res[0];

      });
  }

}
