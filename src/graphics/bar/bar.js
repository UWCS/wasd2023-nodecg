import m from 'mithril';
import gsap from 'gsap';
import moment from 'moment';
import fitty from 'fitty';

import '../common.css';
import './bar.css';

class Ticker extends EventTarget {
  constructor(intervalMs, event) {
    super();

    if (typeof intervalMs !== 'number') {
        throw new TypeError('Expected number');
    }

    this.intervalMs = intervalMs;
    this.event = event || "tick";
  }

  start() {
    this.ticker = setInterval(this.tick.bind(this), this.intervalMs);
  }

  stop() {
    clearInterval(this.ticker);
  }

  tick() {
    this.dispatchEvent(new Event(this.event));
  }
}

class CTA {
  view(vnode) {
    const index = Math.floor(Math.random() * vnode.attrs.barAnnouncementsRep.value.length);
    return m(".cta", m(".cta-text", vnode.attrs.barAnnouncementsRep.value[index]));
  }

  choose_next(vnode) {
    const rotation = vnode.attrs.barAnnouncementsRep.value;
    const index = Math.floor(Math.random() * rotation.length);

    return rotation[index];
  }

  create_anim(vnode) {
    this.bar_ticker = new Ticker(2000);
    this.bar_ticker.addEventListener("tick", () => {
      if (this.anim) this.anim.kill();
      gsap.to('.cta-text', { opacity: 0.0, duration: 0.25});
      setTimeout(() => {
        vnode.dom.children[0].innerHTML = this.choose_next(vnode);
        gsap.to('.cta-text', { opacity: 1.0, duration: 0.25});
      }, 250);
    })
    this.bar_ticker.start()
  }

  oncreate(vnode) {
    this.create_anim(vnode);

    for (let child of vnode.dom.children) {
      fitty(child, { maxSize: 36 });
    }
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
        hold: 5, run: vnode.attrs.nextRun,
        barAnnouncementsRep: vnode.attrs.barAnnouncementsRep,
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
