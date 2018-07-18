import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MusicStateService } from './services/music-state.service';
import { MediaItem } from './interfaces/MediaItem.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('htmlPlayer') htmlPlayer: ElementRef<HTMLAudioElement>;
  public track: MediaItem;
  public isPlay: boolean;
  public canPlay: boolean;
  public loop = false;
  public currentTime = 0;
  public timer: any;
  constructor(
    private musicStateSrv: MusicStateService
  ) { }

  ngOnInit() {
    this.musicStateSrv.$playingTrack.subscribe(track => this.track = track);
    this.musicStateSrv.$volume.subscribe(volume => this.htmlPlayer.nativeElement.volume = volume);
    this.musicStateSrv.$intTime.subscribe(currentTime => this.htmlPlayer.nativeElement.currentTime = currentTime);
    this.musicStateSrv.$isPlay.subscribe(play => {
      this.isPlay = play;
      if (this.canPlay && play) {
        this.htmlPlayer.nativeElement.play();
      }
      if (!play) {
        this.htmlPlayer.nativeElement.pause();
      }
    });
  }

  public trackEnd() {
    this.musicStateSrv.next();
  }

  public trackPlay() {
    // this.musicStateSrv.isPlaying = true;
  }

  public play() {
    this.canPlay = true;
    this.musicStateSrv.setDuration(this.htmlPlayer.nativeElement.duration);
    if (this.isPlay) {
      this.htmlPlayer.nativeElement.play();
    }
  }

  public loadstart() {
    this.canPlay = false;
  }

  public timeupdate(e) {
    if (e.target.currentTime - this.currentTime > 1) {
      this.musicStateSrv.showTime(e.target.currentTime);
      this.currentTime = e.target.currentTime;
    }
  }
}
