import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { navigation } from 'src/app/common/constant';
declare var $: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  productItems: any = [];
  productId = this.activatedRoute.snapshot.paramMap.get('productid');
  details = navigation.productdetails;

  constructor(
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
    this.zoomImage();
  }

  /**
   * get data from local storage
   */
  getDataFromLocalStorage(): void {
    if (localStorage.getItem('products')) {
      this.productItems = JSON.parse(localStorage.getItem('products'));
      if (this.productId) {
        this.productItems = this.productItems.filter(item => String(item.id) === this.productId)[0];
      }
    }
  }

  /**
   * zoom image
   */
  zoomImage(): void {
    $(document).ready(() => {
      $('.easyzoom').easyZoom();
    });
  }
}
