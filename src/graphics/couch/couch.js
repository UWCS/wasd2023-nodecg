import m from 'mithril';
import gsap from 'gsap';
import { get } from 'lodash';

// import BeachBackground from '../beach/beach.js';
import BarComponent from '../bar/bar.js';
import { nextRuns } from '../nextRuns/nextRuns.js';
import { BreakMultiBox, Run } from '../break/break-pages.js';

import '../common.css';
import '../break/break.css';
import './couch.css';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  runArray: NodeCG.Replicant('runDataArray', 'nodecg-speedcontrol'),
  // backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  challenges: NodeCG.Replicant('challenges', 'nodecg-tiltify'),
  polls: NodeCG.Replicant('donationpolls', 'nodecg-tiltify'),
  barAnnouncementsRep: NodeCG.Replicant('barAnnouncements', 'wasd'),
};

class CouchScreenComponent {
  view(vnode) {
    const run = vnode.attrs.nextRuns[0];

    return m('.graphic .fullscreen', [
      // m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.couch-component-container', [
          m('.break-right', [
            m('.break-right-label', 'Coming Up Next'),
            m('.break-h-space'),
            ((vnode.attrs.nextRuns.length === 0)
              ? m('.break-next-run-game', 'NO RUNS!')
              : m(Run, { run: vnode.attrs.nextRuns[0] })),
            m(BreakMultiBox, {
              nextRuns: vnode.attrs.nextRuns,
              incentives: vnode.attrs.incentives,
              polls: vnode.attrs.polls,
              multiline_games: true,
            }),
          ]),
          m('.couch-greenscreen'),
        ]),
      ]),
      m(BarComponent, { total: vnode.attrs.total, barAnnouncementsRep: vnode.attrs.barAnnouncementsRep }),
    ]);
  }
}

NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => {
      return m(CouchScreenComponent, {
        total: Math.floor(replicants.total.value),
        // backgroundModeRep: replicants.backgroundMode,
        nextRuns: nextRuns(replicants.run.value, replicants.runArray.value),
        incentives: replicants.challenges.value,
        polls: replicants.polls.value,
        barAnnouncementsRep: replicants.barAnnouncementsRep,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});
