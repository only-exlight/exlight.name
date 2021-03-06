import {
  Controller,
  Get,
  Param,
  Post,
  SetMetadata,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rating } from '../../models/rating.model';
import {
  META_ACCESS_KEY,
  META_ENTITY_KEY,
  META_PUBLIC_KEY,
} from 'server/src/consts/meta-keys';
import { AuthGuardService } from 'server/src/guards/auth.guard';
import { AccessNamespace, ArticleNamespace } from 'share';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express-serve-static-core';

@Controller({ path: 'api/rating' })
@UseGuards(AuthGuardService)
export class RatingController {
  constructor(
    @InjectRepository(Rating) private ratingRep: Repository<Rating>,
  ) {}

  @Get('/info/article/:articleId')
  @SetMetadata(META_ACCESS_KEY, AccessNamespace.READ)
  @SetMetadata(META_ENTITY_KEY, AccessNamespace.E_ENTITY_TYPES.rating)
  @SetMetadata(META_PUBLIC_KEY, true)
  public async getRating(
    @Param() params: { articleId: string },
    @Req() req: Request,
  ) {
    try {
      const records = await this.ratingRep.find({
        where: { articleId: params.articleId },
        relations: ['user'],
      });
      const ratingInfo: ArticleNamespace.IRatingInfo = {
        average: 0,
        min: 0,
        max: 0,
        isAppreciated: false,
      };
      if (records.length) {
        ratingInfo.max = records[0].rating;
        ratingInfo.min = records[0].rating;
        let sum = 0;
        records.forEach(r => {
          if (r.rating > ratingInfo.max) {
            ratingInfo.max = r.rating;
          }
          if (r.rating < ratingInfo.min) {
            ratingInfo.min = r.rating;
          }
          ratingInfo.isAppreciated =
            ratingInfo.isAppreciated || r.user.id === req.authInfo.id;
          sum += r.rating;
        });
        ratingInfo.average = (sum /
          records.length) as ArticleNamespace.RatingNumber;
        return ratingInfo;
      } else {
        return ratingInfo;
      }
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/to-rate/article/:articleId')
  @SetMetadata(META_ACCESS_KEY, AccessNamespace.CREATE)
  @SetMetadata(META_ENTITY_KEY, AccessNamespace.E_ENTITY_TYPES.rating)
  public async toRateArticle(@Param() params: any, @Req() req: Request) {
    try {
      const rate = await this.ratingRep.findOne({
        article: { id: params.articleId },
        user: { id: req.authInfo.id },
      });
      if (rate) {
        throw new HttpException(
          { error: 'Уже оценено' },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.ratingRep.insert({
          article: { id: params.articleId },
          user: { id: req.authInfo.id },
          rating: req.body.rating,
        });
      }
    } catch (err) {
      throw new HttpException({ error: err }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
