import m from 'mithril';
import gsap from 'gsap';
import moment from 'moment';
import fitty from 'fitty';

import '../common.css';
import './bar.css';
import { ScrollText } from '../common/common.js';

class Ticker extends EventTarget {
  constructor(intervalMs) {
    super();

    if (typeof intervalMs !== 'number') {
        throw new TypeError('Expected number');
    }

    this.intervalMs = intervalMs;
  }

  start() {
    this.ticker = setInterval(this.tick.bind(this), this.intervalMs);
  }

  stop() {
    clearInterval(this.ticker);
  }

  tick() {
    this.dispatchEvent(new Event('tick'));
  }
}

class CTA {
  view(vnode) {
    return m('.cta', vnode.attrs.barAnnouncementsRep.value.map(c => m(".cta-text", c)));
  }

  create_anim(vnode) {
    const ctas = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1 });

    ctas.forEach((c) => {
      tl.fromTo(c, { opacity: 0 }, { opacity: 1 });
      tl.to(c, { opacity: 0 }, "+="+vnode.attrs.hold);
  });

    this.anim = tl;
  }

  oncreate(vnode) {
    this.create_anim(vnode);

    for (let child of vnode.dom.children) {
      fitty(child, { maxSize: 36 });
    }

    vnode.attrs.barAnnouncementsRep.on("change", () => { console.log("change"); this.anim.kill(); this.create_anim(vnode) });
  } 

  onupdate(vnode) {
    for (let child of vnode.dom.children) {
      fitty(child, { maxSize: 36 });
    }
  }

  onremove(vnode) {
    if (this.anim) {
      this.anim.kill();
    }
  }
}

export default class BarComponent {
  view(vnode) {
    return m('.bar', [
      m('.bar-frost'),
      m('.bar-name', [
        m('.bar-logo-wasd-multi', [
          m('.bar-logo-wasd.summer-day'),
          m('.bar-logo-wasd.summer-night'),
        ]),
        m('.bar-name-event', 'WASD 2023'),
      ]),
      m('.bar-v-space'),
      m('.bar-donos', [
        m('.bar-logo-special-effect-multi', [
          m('.bar-logo-special-effect.white'),
          m('.bar-logo-special-effect.orange'),
        ]),
        m('.bar-dono-total', `£${vnode.attrs.total}`),
      ]),
      m('.bar-v-space'),
      m(CTA, {
        hold: 5,
        barAnnouncementsRep: vnode.attrs.barAnnouncementsRep
      }),
      m('.bar-v-space'),
      m('span', moment().format('HH:mm')),
    ]);
  }

  oncreate(vnode) {
    this.ticker = new Ticker(5000); // 5 seconds
    this.ticker.addEventListener('tick', () => { m.redraw(); });
    this.ticker.start();
  }

  onremove(vnode) {
    this.ticker.stop();
  }
}
