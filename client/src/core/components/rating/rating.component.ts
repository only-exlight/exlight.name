import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ArticleNamespace } from '@share/*';

@Component({
  selector: 'ex-rating',
  templateUrl: 'rating.component.html',
  styleUrls: ['rating.component.scss'],
})
export class RatingComponent {
  public ratingValue: ArticleNamespace.RatingNumber = 0;
  public rating: number[] = [0, 0, 0, 0, 0];
  @Input() public readonly: boolean;
  @Output() public change = new EventEmitter<ArticleNamespace.RatingNumber>();

  @Input() set value(val: ArticleNamespace.RatingNumber) {
    this.ratingValue = val || 0;
    const rating: number[] = [];
    for (let i = 0; i < 5; i++) {
      const diff = this.ratingValue - i;
      if (diff <= 0 || diff < 0.3) {
        rating.push(0);
      } else if (diff > 0.7) {
        rating.push(1);
      } else if (diff > 0.3 || diff < 0.7) {
        rating.push(0.5);
      }
    }
    this.rating = rating;
  }

  public evaluation(ind: ArticleNamespace.RatingNumber): void {
    if (!this.readonly) {
      for (let i = 0; i < 5; i++) {
        i <= ind ? (this.rating[i] = 1) : (this.rating[i] = 0);
      }
    }
  }

  public cancelEval(): void {
    if (!this.readonly) {
      this.value = this.ratingValue;
    }
  }

  public estimate(ind: number): void {
    if (!this.readonly) {
      this.change.emit((ind + 1) as ArticleNamespace.RatingNumber);
    }
  }
}
