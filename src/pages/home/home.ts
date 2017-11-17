import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';
import { GenresPage } from '../genres/genres';

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
  genre: any;
  genreName: string = 'Upcoming Games';
  favorites = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loading: LoadingController,
    public modalCtrl: ModalController,
    private _data: DataProvider, 
    private storage: Storage) {

    let loader = this.loading.create({
      content: 'Loading games...',
      spinner: 'dots'
    });

    loader.present().then(() => {
      this.storage.get('genre').then((val) => {
        if (val) {
          this.genre = val.id;
          this.genreName = val.name;
        } else {
          this.genre = 24;
          this.genreName = 'Tactical';
          this.storage.set('genre', this.genre);
        }
        this._data.getGames('12', 0)
          .subscribe(res => this.games = res);
      });

      this.storage.get('favorites').then((val) => {
        if (!val) {
          this.storage.set('favorites', this.favorites);
        } else {
          this.favorites = val;
        }
      });

      loader.dismiss();
    });
  }

  favorite(game) {
    this.favorites.push(game);
    this.favorites = this.favorites.filter(function (item, i, ar) {
      return ar.indexOf(item) === i;
    });
    this.storage.set('favorites', this.favorites);
    console.log(this.favorites);
  }

  removeFavorite(game) {
    this.favorites = this.favorites.filter(function (item) {  
      return item !== game
    });
    this.storage.set('favorites', this.favorites);
  }

  openFavorites() {
    this.storage.get('favorites').then((val) => {
      this.genre = 'Favorites';

      if (val.length != 0) {
        this._data.getFavorites(val)
          .subscribe(res => this.games = res);
      } else {
        this.games.length = 0;
      }
    })
  }

  openGenres() {
    let modal = this.modalCtrl.create(GenresPage);

    modal.onDidDismiss(genre => {
      let loader = this.loading.create({
        content: 'Loading genres...',
        spinner: 'dots'
      });
      if (genre) {
        loader.present().then(() => {
          this.storage.get('genre').then((val) => {
            this.genre = val.id;
            this.genreName = val.name;

            this._data.getGames(this.genre, 0)
              .subscribe(res => this.games = res);
          });
        });
      }
      loader.dismiss();
    });
    modal.present();
  }

  ionViewDidLoad() {
  }

}
