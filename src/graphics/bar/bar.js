import m from 'mithril';
import gsap from 'gsap';
import moment from 'moment';

import '../common.css';
import './bar.css';

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
    return m('.cta', vnode.attrs.ctas.map(c => m('.cta-text', c)));
  }

  oncreate(vnode) {
    const ctas = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1 });

    ctas.forEach((cta) => {
      tl.from(cta, { opacity: 0 });
      tl.to({}, vnode.attrs.hold || 2, {});
      tl.to(cta, { opacity: 0 });
    });

    this.anim = tl;
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
        hold: 30,
        ctas: [
        'Warwick\'s Awesome Speedruns & Demos 2023',
        'See the full schedule at warwickspeed.run/schedule',
        'WASD 2023 is raising money for SpecialEffect',
        'Donate now at warwickspeed.run/donate',
        ]
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
