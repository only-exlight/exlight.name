import { Injectable, Injector } from '@angular/core';
import { Api } from '@core/classes';
import { DEF_CAT } from '@article-module/const/def-cat';
import { CAT_ROUTE_TEMPLATE } from '@article-module/const/urls';
import { CategoriesItem } from '@article-module/models/categories';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentService } from '@app/services/envirement.service';
import { ArticleNamespace } from '@share/';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends Api {
  public categoriesMap = new Map<string, CategoriesItem>();
  public readonly DEF_CAT = new CategoriesItem(DEF_CAT, CAT_ROUTE_TEMPLATE);
  private categories$ = new BehaviorSubject<CategoriesItem[]>([]);
  private categories: CategoriesItem[] = [];

  constructor(injector: Injector, envSrv: EnvironmentService) {
    super(injector, envSrv.API_DOMAIN);
  }

  get $categories(): Observable<CategoriesItem[]> {
    return this.categories$.asObservable();
  }

  public async getCategories(): Promise<CategoriesItem[]> {
    try {
      const answ: ArticleNamespace.ICategory[] = await this.get<
        ArticleNamespace.ICategory[]
      >('category/all');
      return answ.map(item => new CategoriesItem(item, CAT_ROUTE_TEMPLATE));
    } catch (err) {
      return [];
    }
  }

  public async initCategories(categories: CategoriesItem[]): Promise<void> {
    this.DEF_CAT.isActive = true;
    this.categories = [this.DEF_CAT, ...categories];
    this.initCategoriesMap(this.categories);
    this.categories$.next(this.categories);
  }

  private initCategoriesMap(categories: CategoriesItem[]): void {
    categories.forEach(c => this.categoriesMap.set(c.route, c));
  }
}
