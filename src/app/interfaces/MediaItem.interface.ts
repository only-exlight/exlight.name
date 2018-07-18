export interface MediaItem {
  type: string; //'photo' | 'video' | 'music';
  coverUrl: string;
  fileUrl: string;
  title: string;
  discription: string;
  shows: number;
}
