import m from 'mithril';
import gsap from 'gsap';

import '../common.css';
import './currentSong.css';
import { ScrollText } from '../common/common.js';
 
export default class CurrentSongComponent {
  view(vnode) {
    const { name, artist, albumArt, playing } = vnode.attrs;
    
    if (!playing) return null;
    return m('.current-song-container', [
      m('.current-song-art-container',[
        (albumArt) ? m('img.current-song-art', { src: albumArt }) : null,
      ]),
      m('.current-song-details', [
        //m('.current-song-name', { key: name }, name),
        m(ScrollText, { cls: '.current-song-name', txt: name, key: name }),
        m(ScrollText, { cls: '.current-song-artist', txt: artist, key: artist }),
      ]),
    ]);
  }
}
