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

  searchData: any;
  filterData: any;
  locationFilterData: any;

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
    this.getDataFromLocalStorage();
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
        // if (!this.filterData && !this.searchData) {
        // }
      }
    });
  }

  /**
   * search product
   * @param event search value
   */
  searchProduct(event: any): void {
    const val = event.target.value;
    const searchData = this.filterData ? this.filterData : this.productItems;
    if (val.trim() && searchData) {
      this.productArr = searchData.filter(item => {
        return item.title.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.description.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.price).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.rating).toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
      this.searchData = this.productArr;
    } else {
      this.productArr = searchData ? searchData : this.productItems;
    }
    this.noDataFound = this.productArr.length === 0 ? general.nodatafound : '';
  }

  /**
   * filter procut base on stock
   * @param event value
   */
  filterProductStock(event: any): void {
    const filterdata = this.searchData ? this.searchData : this.productItems;
    this.productArr = filterdata.filter(item =>
      String(item.stock) === String(event.target.defaultValue)
    );
    this.filterData = this.productArr;
    this.noDataFound = this.productArr.length === 0 ? general.nodatafound : '';
  }

  /**
   * filter procut base on location
   * @param event value
   * @param location locations
   */
  filterByLocation(event: any, location: string): void {
    if (location === 'ahmedabad') {
      this.locationFilterData = this.getAllProducts.filter(item => item.location.ahmedabad === event.target.checked);
      this.productArr = this.locationFilterData;
    }
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
