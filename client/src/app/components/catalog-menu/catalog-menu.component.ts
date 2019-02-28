import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-menu',
  templateUrl: './catalog-menu.component.html',
  styleUrls: ['./catalog-menu.component.scss']
})
export class CatalogMenuComponent implements OnInit {
  @Input() showMenu: boolean;
  @Input() catalogName: string;
  @Input() categories: any[];
  @Input() currentpage: number;
  @Output() selectedCat = new EventEmitter();
  public selectCat: string = null;

  ngOnInit() { }

  public selectCategory(route: string) {
    this.selectCat = route;
    this.selectedCat.emit(route);
  }
}
