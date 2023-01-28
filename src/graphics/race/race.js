import m from 'mithril';
import gsap from 'gsap';
import { get } from 'lodash';
import fitty from 'fitty';

import '../common.css'
import './race.css';

import TimerComponent from '../timer/timer.js';
import RunnersComponent from '../runners/runners.js';
import CouchComponent from '../couch/couch.js';
import BeachBackground from '../beach/beach.js';
import BarComponent from '../bar/bar.js';
import { RunGameComponent } from '../common/common.js';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  timer: NodeCG.Replicant('timer', 'nodecg-speedcontrol'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
};

class RunDetailsComponent {
  view(vnode) {
    const system = get(vnode, 'attrs.run.system');
    const release = get(vnode, 'attrs.run.release');
    const category = get(vnode, 'attrs.run.category');
    const sep = '/';

    return  m('.run-details', `${system}  ${sep}  ${release}  ${sep}  ${category}`);
  }

  onupdate(vnode) {
    fitty(vnode.dom, { maxSize: 23, multiline: false });
  }

  oncreate(vnode) {
    fitty(vnode.dom, { maxSize: 23, multiline: false });
  }
}

class Logos {
  view() {
    return m('.logos', [
      m('.logo-multi', [
        m('.logo .wasd-light'),
        m('.logo .wasd-dark'),
      ]),
      m('.logo-multi', [
        m('.logo .special-effect-white'),
        m('.logo .special-effect-orange'),
      ]),
    ]);
  }

  onremove(vnode) {
    if (this.anim) {
      this.anim.kill();
    }
  }

  oncreate(vnode) {
    const logos = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1 });

    logos.forEach((logo) => {
      tl.from(logo, { opacity: 0 });
      tl.to({}, vnode.attrs.hold || 2, {});
      tl.to(logo, { opacity: 0 });
    });

    this.anim = tl;
  }
}

class RaceComponent {
  view(vnode) {
    return m('.graphic .fullscreen', [
      m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.game .top'),
        m('.game .bottom'),
        m('.left', [
          m('.run-info', [
            m(RunGameComponent, { game: get(vnode, 'attrs.run.game') }),
            m(RunDetailsComponent, { run: get(vnode, 'attrs.run') }),
          ]),
          m('.run-spacer'),
          m('.run-timing', [
            m(TimerComponent, { time: vnode.attrs.time }),
            m('.run-estimate', `Estimate: ${get(vnode, 'attrs.run.estimate')}`),
          ]),
          m('.cam'),
          m(RunnersComponent, {
            players: get(vnode, 'attrs.run.teams[0].players'),
            customData: get(vnode, 'attrs.run.customData'),
          }),
          m(CouchComponent, { customData: get(vnode, 'attrs.run.customData') }),
          m(Logos, { hold: 22 }),
        ]),
      ]),
      m(BarComponent, { total: vnode.attrs.total }),
    ]);
  }
}

NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => {
      return m(RaceComponent, {
        run: replicants.run.value,
        time: replicants.timer.value.time,
        total: Math.floor(replicants.total.value),
        backgroundModeRep: replicants.backgroundMode,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});
