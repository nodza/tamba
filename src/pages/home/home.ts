import { Component, ViewChild, trigger, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { DataProvider } from '../../providers/data/data';
import { GenresPage } from '../genres/genres';
import { DetailsPage } from '../details/details';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-in', keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-50px)', offset: 1 }),
        ]))
      ]),
      transition(':enter', [
        animate('300ms ease-in', keyframes([
          style({ opacity: 0, transform: 'translateX(-50px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class HomePage {
  @ViewChild(Content) content: Content;

  showSearch = false;
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
    public keyboard: Keyboard,
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
        this._data.getGames(this.genre, 0)
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

  showSearchBox() {
    this.showSearch = !this.showSearch;
    this.content.scrollToTop();
  }

  search(term) {
    let search_term = term;
    this.keyboard.close();
    this.genreName = search_term;
    this.showSearch = false;
    this._data.searchGames(search_term)
      .subscribe(res => this.games = res);
  }

  detailsPage(game) {
    this.navCtrl.push(DetailsPage, {
      game: game
    })
  }

  ionViewDidLoad() {
  }

}
