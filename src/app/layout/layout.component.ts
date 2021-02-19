import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { navigation } from '../common/constant';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  trash = navigation.trash;
  isShowMenuIcon = location.pathname.search('product/details') === -1;

  constructor(
    public appService: AppService,
  ) { }

  ngOnInit(): void {
    this.updateMenuBackIcons();
  }

  /**
   * go back to previous page
   */
  goBack(): void {
    history.back();
    this.isShowMenuIcon = true;
  }

  /**
   * change menu and back icon
   */
  updateMenuBackIcons(): void {
    this.appService.updateMenuBackIcon.subscribe((res: any) => {
      if (res) {
        this.isShowMenuIcon = res && res.is_show_menu_icon;
      }
    });
  }
}
