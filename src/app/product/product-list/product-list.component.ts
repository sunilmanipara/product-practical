import { Component, OnInit } from '@angular/core';
import { navigation, general } from '../../common/constant';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  productadd = navigation.productadd;
  productedit = navigation.productedit;
  trash = navigation.trash;
  noDataFound: any = '';
  getAllProducts: any = [];
  productArr: any = [];
  productItems: any = [];

  search = '';
  locationArr: any = [
    { name: 'Ahmedabad', value: 'ahmedabad', is_selected: false },
    { name: 'Rajkot', value: 'rajkot', is_selected: false },
    { name: 'Baroda', value: 'baroda', is_selected: false },
    { name: 'Surat', value: 'surat', is_selected: false }
  ];
  selectedLocation: any = [];

  selectedRating: any = [];
  ratingArr = [1, 2, 3, 4, 5];

  is_stock: any = 'ALL';
  stockArr: any = [
    { title: 'In Stock', value: true },
    { title: 'Out Stock', value: false },
  ];


  constructor(
    public matDialog: MatDialog,
    public router: Router,
    public appService: AppService,
  ) { }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
  }

  /**
   * get data from local storage
   */
  getDataFromLocalStorage(): void {
    if (localStorage.getItem('products')) {
      this.getAllProducts = JSON.parse(localStorage.getItem('products'));
      this.productItems = this.getAllProducts.filter(item => !item.is_soft_delete);
      this.productArr = this.productItems;
      if (this.productArr.length === 0) {
        this.noDataFound = general.nodatafound;
      }
    } else {
      this.noDataFound = general.nodatafound;
    }
  }

  /**
   * like product
   * @param productid product id
   */
  likeProduct(productid: number): void {
    const index = this.getAllProducts.findIndex(item => item.id === productid)[0];
    const filterProduct = this.getAllProducts.filter(item => item.id === productid)[0];
    filterProduct.is_favourite = !filterProduct.is_favourite;
    this.getAllProducts[index] = filterProduct;
    localStorage.setItem('products', JSON.stringify(this.getAllProducts));
    if (!this.search && !this.is_stock) {
      this.getDataFromLocalStorage();
    }
  }

  /**
   * remove product
   * @param productid product id
   */
  removeProduct(productid: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const index = this.getAllProducts.findIndex(item => item.id === Number(productid));
        const filterProduct = this.getAllProducts.filter(item => item.id === Number(productid))[0];
        filterProduct.is_soft_delete = true;
        this.getAllProducts[index] = filterProduct;
        localStorage.setItem('products', JSON.stringify(this.getAllProducts));
        this.getDataFromLocalStorage();
        this.searchProduct();
      }
    });
  }

  /**
   * search product
   */
  searchProduct(): void {
    this.productArr = [];
    // this.productArr = this.productItems.filter(item => {
    //   return this.searchItem(item);
    // });
    this.productArr = this.productItems.filter((item) =>
      (!this.selectedRating.filter(items => items).length || this.selectedRating[item.rating])
      && (this.is_stock === 'ALL' || item.is_stock === this.is_stock)
      && (!this.selectedLocation.filter(items => items.is_selected).length || item.location.find(places => {
        return this.selectedLocation.find(location => {
          return location.is_selected && places.is_selected && location.value === places.value;
        });
      }))
    );
    this.noDataFound = this.productArr.length === 0 ? general.nodatafound : '';
  }

  /**
   * select places
   * @param event object
   */
  selectPlaces(event: any, place: any, locationIndex: number): void {
    place.is_selected = event.target.checked;
    this.locationArr[locationIndex] = place;
    this.selectedLocation = this.locationArr;
    this.searchProduct();
  }

  /**
   * search product
   * @param item product data
   */
  searchItem(item: any): any {
    return item.title.toLowerCase().indexOf(this.search.trim().toLowerCase()) > -1 ||
      item.description.toLowerCase().indexOf(this.search.trim().toLowerCase()) > -1 ||
      String(item.price).toLowerCase().indexOf(this.search.trim().toLowerCase()) > -1 ||
      String(item.rating).toLowerCase().indexOf(this.search.trim().toLowerCase()) > -1;
  }

  /**
   * go to product details
   * @param product product id
   */
  gotoProductDetails(productid: number): void {
    this.appService.updateIcons({ is_show_menu_icon: false });
    this.router.navigate([navigation.productdetails, productid]);
  }
}
