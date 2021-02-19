import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SoftDeletedProductComponent } from './soft-deleted-product/soft-deleted-product.component';

const product: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'trash', component: SoftDeletedProductComponent },
  { path: 'details/:productid', component: ProductDetailsComponent },
  { path: 'add', component: ProductEditorComponent },
  { path: 'edit/:productid', component: ProductEditorComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(product)
  ]
})
export class ProductRoutingModule { }

export const routedComponent = [
  ProductListComponent,
  ProductDetailsComponent,
  ProductEditorComponent,
  ConfirmationDialogComponent,
  SoftDeletedProductComponent,
];

