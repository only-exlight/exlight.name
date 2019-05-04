import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Category } from './category.model';

export interface IArticle {
    id: number;
    title: string;
    publicationDate: string | Date;
    description: string;
    content: string;
    // views: number;
    categoryId: number;
    route: string;
    // rating: number;
    // isAppreciated: boolean;
}

@Entity()
export class Atricle implements IArticle {
    @PrimaryColumn() public id: number;
    @Column() public title: string;
    @Column({ type: 'date' })
    public publicationDate: Date;
    @Column() public description: string;
    @Column() public content: string;
    @Column() public route: string;

    @OneToMany(type => Category, category => category.id)
    public categoryId: number;

}