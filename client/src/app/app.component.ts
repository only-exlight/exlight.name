import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MusicStateService } from './services/music-state.service';
import { MediaItem } from './interfaces/MediaItem.interface';
import { EnviromentService } from './services/envirement.service';
import { E_SCREEN_TYPE } from './enums/screen-type';

@Component({
  selector: 'ex-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('htmlPlayer') public  htmlPlayer: ElementRef<HTMLAudioElement>;
  public track: MediaItem;
  public isPlay: boolean;
  public canPlay: boolean;
  public loop = false;
  public currentTime = 0;
  public timer: any;
  constructor(
    private musicStateSrv: MusicStateService,
    private envSrv: EnviromentService
  ) {
    this.envSrv.$screenType.subscribe(type => console.warn(E_SCREEN_TYPE[type]));
  }

  public ngOnInit(): void {
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

  public trackEnd(): void {
    this.musicStateSrv.next();
  }

  public trackPlay(): void {
    // this.musicStateSrv.isPlaying = true;
  }

  public play(): void {
    this.canPlay = true;
    this.musicStateSrv.setDuration(this.htmlPlayer.nativeElement.duration);
    if (this.isPlay) {
      this.htmlPlayer.nativeElement.play();
    }
  }

  public loadstart(): void {
    this.canPlay = false;
  }

  public timeupdate(e): void {
    if (e.target.currentTime - this.currentTime > 1) {
      this.musicStateSrv.showTime(e.target.currentTime);
      this.currentTime = e.target.currentTime;
    }
  }
}
