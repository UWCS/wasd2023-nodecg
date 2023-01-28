import m from 'mithril';
import gsap from 'gsap';

import '../common.css';
import './currentSong.css';

class ScrollText {
  view(vnode) {
    return m(vnode.attrs.cls, vnode.attrs.txt);
  }

  onremove(vnode) {
    if (this.scroll) {
      this.scroll.kill();
    }
  }

  oncreate(vnode) {
    const parentPadding = 2 * parseInt(window.getComputedStyle(vnode.dom.parentElement).paddingLeft, 10);
    const parentWidth = vnode.dom.parentElement.clientWidth - parentPadding;

    const textWidth = vnode.dom.clientWidth;

    if (parentWidth >= textWidth) {
      return;
    }

    const distance = textWidth - parentWidth;
    const speed = 24; // pixels per second

    const tl = gsap.timeline({ repeat: -1 });

    tl.to({}, 3, {});
    tl.to(vnode.dom, {
      x: `-=${distance}`,
      ease: 'none',
      duration: distance / speed,
    });
    tl.to({}, 2, {});
    tl.to(vnode.dom, { x: 0 });

    this.scroll = tl;
  }
}

export default class CurrentSongComponent {
  view(vnode) {
    const { name, artist, albumArt } = vnode.attrs;

    return m('.current-song-container', [
      m('.current-song-art-container',[
        (albumArt) ? m('img.current-song-art', { src: albumArt }) : null,
      ]),
      m('.current-song-details', [
        //m('.current-song-name', { key: name }, name),
        m(ScrollText, { cls: '.current-song-name', txt: name, key: name }),
        m(ScrollText, { cls: '.current-song-artist', txt: artist, key: artist }),
        m('.current-song-details-clip .left', { key: 'clip-left' }),
        m('.current-song-details-clip .right', { key: 'clip-right' }),
      ]),
    ]);
  }
}
