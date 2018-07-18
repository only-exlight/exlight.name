import { Component, OnInit } from '@angular/core';
import { MusicStateService } from '../../services/music-state.service';
import { MediaItem } from '../../interfaces/MediaItem.interface';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  public isPlay: boolean;
  public tracks: MediaItem[];
  public playingTrack: MediaItem;
  public volume = 1;
  public currentTime = 0;
  public duration: number;

  constructor(
    private musicStateSrv: MusicStateService
  ) { }

  ngOnInit() {
    this.musicStateSrv.$musicItems.subscribe(tracks => this.tracks = tracks);
    this.musicStateSrv.$playingTrack.subscribe(playingTrack => this.playingTrack = playingTrack);
    this.musicStateSrv.$isPlay.subscribe(play => this.isPlay = play);
    this.musicStateSrv.$volume.subscribe(volume => this.volume = volume);
    this.musicStateSrv.$currentTime.subscribe(currentTime => this.currentTime = currentTime);
    this.musicStateSrv.$duration.subscribe(duration => this.duration = duration);
  }

  public play() {
    this.musicStateSrv.play();
  }

  public pause() {
    this.musicStateSrv.pause();
  }

  public prevTrack() {
    this.musicStateSrv.prev();
  }

  public nextTrack() {
    this.musicStateSrv.next();
  }

  public playTrack(track: MediaItem) {
      this.musicStateSrv.playTrack(track);
  }

  public changeVolume(e: any) {
    console.log(e.target.value);
    this.musicStateSrv.changeVolume(e.target.value);
  }

  public changePosition(e: any) {
    this.musicStateSrv.navByTrack(e.target.value);
  }

}
