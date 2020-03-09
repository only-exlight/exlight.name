import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnInit,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ex-comment-control',
  templateUrl: 'comment-control.component.html',
  styleUrls: ['comment-control.component.scss'],
})
export class CommentControlComponent implements OnInit {
  public form = new FormGroup({
    comment: new FormControl(null, [Validators.required]),
  });
  @Input() public autofocus = false;
  @Input() public type: 'new' | 'edit' | 'answer' = 'new';
  @Output() public send = new EventEmitter();
  @Output() public cancel = new EventEmitter();

  @Input() set message(val: string) {
    this.comment.setValue(val);
  }

  @Input() set wait(val: boolean) {
    if (val) {
      this.comment.disable();
    } else {
      this.comment.enable();
      this.comment.reset();
    }
  }

  @ViewChild('area') public textarea: ElementRef<HTMLTextAreaElement>;

  public ngOnInit(): void {
    if (this.autofocus) {
      this.textarea.nativeElement.focus();
    }
  }

  get comment(): FormControl {
    return this.form.get('comment') as FormControl;
  }

  public async createComment(): Promise<void> {
    if (this.form.valid) {
      this.send.emit(this.comment.value);
    }
  }

  public cancelEdit(): void {
    this.cancel.emit();
  }
}
