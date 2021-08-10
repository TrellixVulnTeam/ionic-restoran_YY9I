import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { ToastController } from '@ionic/angular';
import {environment} from '../../environments/environment';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  keranjang: [];
  id_user;
  user: any = {};
  hapus: any = {};
  pathGambar;
  total;
  biaya;
  wilayah;
  grandTotal;
  constructor(private storage: Storage,
              private http: HttpClient,
              private ls: LoadingService,
              private toast: ToastController,
              public navCtrl: NavController,
              private router: Router) {}

  ngOnInit(): void {
    this.pathGambar = environment.gambarUrl;
  }

  ionViewWillEnter() {
    this.getKeranjang();
  }

  async hapusItem(id_produk){
    this.id_user = await this.storage.get(environment.ID);
    this.hapus.id_user = this.id_user;
    this.hapus.id_produk = id_produk;

    this.ls.present();
    this.http.post(environment.baseUrl + 'keranjang/delete.php', this.hapus).subscribe((res: any) => {
      console.log(res);
      this.ls.dismiss();
      this.showToast(res.message);
      this.getKeranjang();
    });
  }


  async getKeranjang(){
    this.id_user = await this.storage.get(environment.ID);
    this.biaya = await this.storage.get(environment.HARGA);
    this.wilayah = await this.storage.get(environment.NAMA_WILAYAH);

    this.user.id_user = this.id_user;
    this.ls.present();
    this.http.post(environment.baseUrl + 'keranjang/get.php', this.user).subscribe((res: any) => {
      console.log(res);
      this.ls.dismiss();
      this.keranjang = res.message;

      this.total = 0;
      for (let item of this.keranjang){
        this.total = this.total + parseInt(item['total']);
      }
      console.log('Total keranjang : ' + this.total);
      this.grandTotal = parseInt(this.biaya) + parseInt(this.total);
    });
  }

  async showToast(str){
    await this.toast.create({
      message: str,
      duration: 2000,
      position: 'bottom',
      buttons: [{
        text: 'OK',
        handler: () => {
          console.log('OK Clicked');
        }
      }]
    }).then(x => x.present());
  }

}
