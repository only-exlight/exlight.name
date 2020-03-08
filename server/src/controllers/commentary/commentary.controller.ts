import {
  Controller,
  Body,
  Param,
  Post,
  HttpStatus,
  HttpException,
  Put,
  Delete,
  Get,
  SetMetadata,
  UseGuards,
  Req,
} from '@nestjs/common';
import {  TreeRepository } from 'typeorm';
import { Commentary } from 'server/src/models/commentary.model';
import {
  META_ACCESS_KEY,
  META_ENTITY_KEY,
  META_PUBLIC_KEY,
} from 'server/src/consts/meta-keys';
import { AuthGuardService } from 'server/src/guards/auth.guard';
import { AccessNamespace, ArticleNamespace } from 'share';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express-serve-static-core';

@Controller({ path: 'api/commentary' })
@UseGuards(AuthGuardService)
export class CommentaryController {
  constructor(
    @InjectRepository(Commentary)
    private commentaryRep: TreeRepository<Commentary>,
  ) {}

  @Post('/item/article/:articleId')
  @SetMetadata(META_ACCESS_KEY, AccessNamespace.CREATE)
  @SetMetadata(META_ENTITY_KEY, AccessNamespace.E_ENTITY_TYPES.commentary)
  public async addCommentary(
    @Body() comment: Partial<ArticleNamespace.IArticleCommentary>,
    @Param() params: ArticleNamespace.ICommentaryApiParams,
    @Req() req: Request,
  ): Promise<number> {
    try {
      const { identifiers } = await this.commentaryRep.insert({
        article: { id: Number(params.articleId) },
        user: { id: req.authInfo.id },
        ...comment,
      });
      return identifiers[0].id;
    } catch (err) {
      throw new HttpException({ error: err }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id/article')
  @SetMetadata(META_ACCESS_KEY, AccessNamespace.UPDATE)
  @SetMetadata(META_ENTITY_KEY, AccessNamespace.E_ENTITY_TYPES.commentary)
  public async updateCommentarty(
    @Param() params: ArticleNamespace.ICommentaryApiParams,
    @Body() comment: Partial<ArticleNamespace.IArticleCommentary>,
  ): Promise<void> {
    try {
      const dbRes = await this.commentaryRep.update(params.id, comment);
    } catch (err) {
      throw new HttpException({ error: err }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id/article')
  @SetMetadata(META_ACCESS_KEY, AccessNamespace.DELETE)
  @SetMetadata(META_ENTITY_KEY, AccessNamespace.E_ENTITY_TYPES.commentary)
  public async deleteCommentary(
    @Param() params: ArticleNamespace.ICommentaryApiParams,
  ): Promise<void> {
    // I realy want delete comments?
    // Delete if admin, mark as delete for users.
    try {
      await this.commentaryRep.delete(params.id);
    } catch (err) {
      throw new HttpException({ error: err }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/list/article/:articleId')
  @SetMetadata(META_ACCESS_KEY, AccessNamespace.READ)
  @SetMetadata(META_ENTITY_KEY, AccessNamespace.E_ENTITY_TYPES.commentary)
  @SetMetadata(META_PUBLIC_KEY, true)
  public async commentaryList(
    @Param() params: ArticleNamespace.ICommentaryApiListParams,
  ): Promise<ArticleNamespace.IArticleCommentary[]> {
    try {
      const { articleId, limit, start } = params;
      const comments = await this.commentaryRep.find({
        where: { articleId },
        skip: start,
        take: limit,
        relations: ['comments', 'user'],
      });
      return comments;
    } catch (err) {
      throw new HttpException({ error: err }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
