import aisleSong from '@/assets/audios/I Saw You at the End of the Aisle.mp3';

export type Song = {
    id: string;
    title: string;
    author: string;
    duration: number;
    length: string;
    excerpt: string;
    body: string;
    audioSrc: string;
};

export const songs: Song[] = [{
    id: 'i-saw-you-at-the-end-of-the-aisle',
    title: 'I Saw You at the End of the Aisle',
    author: 'Adriaan M. Dimate',
    duration: 0,
    length: 'Local audio',
    excerpt: 'A song waiting behind the lantern.',
    body: '',
    audioSrc: aisleSong,
}];
