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

  product: any = { is_stock: true, location: [] } as Products;
  productArr: any = [];
  imageUrlFormat = general.imagevalidation;
  productId = this.activatedRoute.snapshot.paramMap.get('productid');
  formLabel = this.productId ? 'Edit Product' : 'Add Product';

  locationArr: any = [
    { name: 'Ahmedabad', value: 'ahmedabad', is_selected: false },
    { name: 'Rajkot', value: 'rajkot', is_selected: false },
    { name: 'Baroda', value: 'baroda', is_selected: false },
    { name: 'Surat', value: 'surat', is_selected: false }
  ];
  selectedLocation: any = [];
  ratingArr: any = [1, 2, 3, 4, 5];
  stockArr: any = [
    { title: 'In Stock', value: true },
    { title: 'Out Stock', value: false }
  ];

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
        this.locationArr = this.product.location;
        console.log(this.locationArr);
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
   * select places
   * @param event object
   */
  selectPlaces(event: any, place: any, locationIndex: number): void {
    place.is_selected = event.checked;
    this.locationArr[locationIndex] = place;
    this.selectedLocation = this.locationArr;
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
    this.product.location = this.selectedLocation;
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
