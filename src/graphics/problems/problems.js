import m from 'mithril';
import gsap from 'gsap';

import '../common.css';
import './problems.css';

import BeachBackground from '../beach/beach.js';

const replicants = {
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
};

class ProblemsComponent {
  view(vnode) {
    return m('.graphic .fullscreen', [
      m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.logos', [
        m('.logo-multi', [
            m('.logo .wasd-light'),
            m('.logo .wasd-dark'),
        ]),
      ]),
      m(".dvd"),
      m('.problems-text', 'Technical Difficulties'),
    ]);
  }
}

NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => m(ProblemsComponent, {
      backgroundModeRep: replicants.backgroundMode,
    })
  });
});
