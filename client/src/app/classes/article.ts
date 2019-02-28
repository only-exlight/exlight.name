import * as dateformat from 'dateformat';

export interface IArticle {
    id: number;
    title: string;
    publicationDate: string;
    description: string;
    content: string;
    views: number;
    category: number;
    route: string;
}

export interface IArticleApiData {
    totalItems: number;
    articles: IArticle[];
    category?: number;
}

export class Article implements IArticle {
    public readonly id: number = this.__data.id;
    public title: string = this.__data.title;
    public publicationDate: string = dateformat(new Date(this.__data.publicationDate), 'dd.mm.yyyy');
    public description: string = this.__data.description;
    public content: string = this.__data.content;
    public views: number = this.__data.views;
    public category: number  = this.__data.category;
    public route: string = this.__data.route;

    constructor(private __data: IArticle) {}
}