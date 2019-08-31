import { Injectable, Injector } from '@angular/core';
import { Api } from '@core/classes';
import { EnviromentService } from '@app/services/envirement.service';
import { ArticleNamespace } from '@share/';

@Injectable({
    providedIn: 'root'
})
export class RatingService extends Api {
    constructor(
        injector: Injector,
        envSrv: EnviromentService
    ) {
        super(injector, envSrv.API_DOMAIN);
    }

    public async getArticleRating(articleId: number): Promise<ArticleNamespace.IRatingInfo> {
        try {
            const rating = await this.get<ArticleNamespace.IRatingInfo>(`rating/info/article/${articleId}`);
            return rating;
        } catch (error) {
            return {
                avarage: 0,
                max: 0,
                min: 0,
            };
        }
    }

    public async setArticleRating(articleId: number, rating: ArticleNamespace.RatingNumber): Promise<boolean> {
        try {
            await this.post(`rating/to-rate/article/${articleId}`, { rating });
            return true;
        } catch (error) {
            return false;
        }
    }
}