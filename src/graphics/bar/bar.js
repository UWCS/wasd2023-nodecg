import m from 'mithril';
import gsap from 'gsap';
import moment from 'moment';
import fitty from 'fitty';
import { get } from 'lodash';

import '../common.css';
import './bar.css';

import { runParse } from '../common/common.js';

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
    this.vnode = vnode;
    return m(".cta", m(".cta-text", "Empty"));
  }

  choose_next() {
    const rotation = this.vnode.attrs.barAnnouncementsRep.value;
    const index = Math.floor(Math.random() * rotation.length);
    let choice = rotation[index];
    if (choice === '{{ next run }}') {
      let run = this.vnode.attrs.nextRuns[0];
      if (run) {
        run = runParse(run);
        choice = `Up Next at ${run.when}: ${run.runners} will be running ${run.game}: ${run.category}`;
        if (run.game === "Setup") choice = null;
      }
    }
    return choice || 'Donate now at warwickspeed.run/donate';
  }

  create_anim(vnode) {
    const elem = vnode.dom.children[0];
    let tl = gsap.timeline({ repeat: -1 });
    tl.to(elem, { opacity: 0 });
    tl.add(() => elem.innerText = this.choose_next());
    tl.to(elem, { opacity: 1 });
    tl.to({}, 5, {});

    this.anim = tl;
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
        hold: 5, nextRuns: vnode.attrs.nextRuns,
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
