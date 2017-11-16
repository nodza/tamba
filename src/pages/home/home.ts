import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  games = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _data: DataProvider) {
    this._data.getGames('12', 0)
      .subscribe(res => this.games = res);

    console.log(this.games);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
