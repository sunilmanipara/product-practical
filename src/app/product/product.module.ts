import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule, routedComponent } from './product-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ...routedComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    RouterModule,
    MaterialModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductModule { }
