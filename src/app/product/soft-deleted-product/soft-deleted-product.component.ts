import { Component, OnInit } from '@angular/core';
import { general } from '../../common/constant';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-soft-deleted-product',
  templateUrl: './soft-deleted-product.component.html',
  styleUrls: ['./soft-deleted-product.component.scss']
})
export class SoftDeletedProductComponent implements OnInit {

  productArr: any = [];
  productData: any = [];
  noDataFound: any = '';

  constructor(
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
  }

  /**
   * get data from local storage
   */
  getDataFromLocalStorage(): void {
    if (localStorage.getItem('products')) {
      this.productData = JSON.parse(localStorage.getItem('products'));
      this.productArr = this.productData.filter(item => item.is_soft_delete);
      if (this.productArr.length === 0) {
        this.noDataFound = general.nodatafound;
      }
    } else {
      this.noDataFound = general.nodatafound;
    }
  }

  /**
   * remove product permanently
   * @param productid product id
   */
  restoreProduct(productid: number): void {
    const index = this.productData.findIndex(item => item.id === productid);
    const filterProduct = this.productData.filter(item => item.id === productid)[0];
    filterProduct.is_soft_delete = false;
    this.productData[index] = filterProduct;
    localStorage.setItem('products', JSON.stringify(this.productData));
    this.getDataFromLocalStorage();
  }

  /**
   * remove product permanently
   * @param productid product id
   */
  removeProduct(productid: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.productData = this.productData.filter(item => item.id !== productid);
        localStorage.setItem('products', JSON.stringify(this.productData));
        this.getDataFromLocalStorage();
      }
    });
  }

  /**
   * go to previous page
   */
  goback(): void {
    history.back();
  }
}
