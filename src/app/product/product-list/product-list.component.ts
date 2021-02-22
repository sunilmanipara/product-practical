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

  priceArr: any = [
    { price: '100 - 1000', min: 100, max: 1000 },
    { price: '1000 - 2000', min: 1000, max: 2000 },
    { price: '2000 - 3000', min: 2000, max: 3000 },
    { price: '3000 - 4000', min: 3000, max: 4000 },
    { price: '4000 - 5000', min: 4000, max: 5000 },
  ];

  locationArr: any = [
    { name: 'Ahmedabad', value: 'ahmedabad' },
    { name: 'Rajkot', value: 'rajkot' },
    { name: 'Baroda', value: 'baroda' },
    { name: 'Surat', value: 'surat' }
  ];

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
    this.productArr = this.productItems.filter((item) =>
      (!this.search || this.searchItem(item))
      && (!this.selectedRating.filter(items => items).length || this.selectedRating[item.rating])
      && (this.is_stock === 'ALL' || item.is_stock === this.is_stock)
      && (!this.locationArr.filter(items => items.is_selected).length || item.location.find(places => {
        return this.locationArr.find(location => {
          return location.is_selected && places.is_selected && location.value === places.value;
        });
      }))
      && (!this.priceArr.filter(items => items.is_selected).length ||
        this.priceArr.find(findprice => {
          return findprice.is_selected
            && (findprice.min <= item.price && findprice.max >= item.price);
        })
      )
    );
    this.noDataFound = this.productArr.length === 0 ? general.nodatafound : '';
  }

  /**
   * clear filter
   */
  clearFliter(): any {
    this.productArr = this.productItems;
    this.search = '';
    this.selectedRating = [];
    this.is_stock = 'ALL';
    this.priceArr.forEach(element => {
      delete element.is_selected;
    });
    this.locationArr.forEach(element => {
      delete element.is_selected;
    });
  }

  /**
   * select places
   * @param event object
   */
  selectPlaces(event: any, place: any, locationIndex: number): void {
    this.locationArr[locationIndex]['is_selected'] = event.target.checked;
    this.searchProduct();
  }

  /**
   * selecte price
   * @param event any
   * @param pricerange price range
   * @param priceIndex price index
   */
  selectPrice(event: any, pricerange: any, priceIndex: number): any {
    pricerange.is_selected = event.target.checked;
    this.priceArr[priceIndex] = pricerange;
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
