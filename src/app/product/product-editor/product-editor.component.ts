import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { general, productmsg } from '../../common/constant';
import { Products } from '../product-interface';
import { Functions } from '../../common/functions';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit {

  product: any = {
    stock: '1',
    location: {
      ahmedabad: false,
      surat: false,
      rajkot: false,
      baroda: false,
    }
  } as Products;
  productArr: any = [];
  imageUrlFormat = general.imagevalidation;
  productId = this.activatedRoute.snapshot.paramMap.get('productid');
  formLabel = this.productId ? 'Edit Product' : 'Add Product';
  ratingArr: any = [1, 2, 3, 4, 5];

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public functions: Functions,
  ) { }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
  }

  /**
   * get data from local storage
   */
  getDataFromLocalStorage(): void {
    if (localStorage.getItem('products')) {
      this.productArr = JSON.parse(localStorage.getItem('products'));
      if (this.productId) {
        this.product = this.productArr.filter(item => String(item.id) === this.productId)[0];
      }
    }
  }

  /**
   * go to previous page
   */
  goback(): void {
    history.back();
  }

  /**
   * submit to add / edit product
   */
  submitForm(): any {
    if (this.product.title.length > 50) {
      this.functions.snackMessage(productmsg.maxlength, 'error-snackbar');
      return false;
    }
    if (this.product.description.length < 150) {
      this.functions.snackMessage(productmsg.minlength, 'error-snackbar');
      return false;
    }
    if (!this.imageUrlFormat.test(this.product.image_url)) {
      this.functions.snackMessage(productmsg.imagemsg, 'error-snackbar');
      return false;
    }
    this.submitDataAfterCheckingValidation();
  }

  /**
   * submit data after checking validation
   */
  submitDataAfterCheckingValidation(): any {
    if (this.productArr.length > 0) {
      if (!this.productId) {
        this.product.id = this.productArr.length + 1;
        this.productArr.push(this.product);
      } else {
        const indext = this.productArr.findIndex(item => String(item.id) === this.productId);
        this.productArr[indext] = this.product;
      }
    } else {
      this.product.id = 1;
      this.productArr = [this.product];
    }
    const message = this.productId ? productmsg.updatesuccess : productmsg.createsuccess;
    this.functions.snackMessage(message);
    localStorage.setItem('products', JSON.stringify(this.productArr));
    this.router.navigate(['/']);
  }
}
