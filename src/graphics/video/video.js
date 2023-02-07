import m from 'mithril';
import gsap from 'gsap';
import { get } from 'lodash';

import BeachBackground from '../beach/beach.js';
import BarComponent from '../bar/bar.js';
import { nextRuns } from '../nextRuns/nextRuns.js';

import '../common.css';
import './video.css';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  runArray: NodeCG.Replicant('runDataArray', 'nodecg-speedcontrol'),
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  barAnnouncementsRep: NodeCG.Replicant('barAnnouncementsRep', 'wasd'),
};

class UpNext {
  view(vnode) {
    let run;
    if (vnode.attrs.nextRuns.length === 0) {
      run = { game: 'No More Runs!' };
    } else {
      run = vnode.attrs.nextRuns[0];
    }

    const details = [
      get(run, 'category', ''),
      get(run, 'teams[0].players', []).map(p => p.name).join(', '),
      get(run, 'system', ''),
      get(run, 'estimate'),
    ].filter(e => e).join(' / ');

    return m('.video-up-next-container', [
      m('.video-up-next-label', 'Coming Up Next'),
      m('.video-v-space'),
      m('.video-up-next-game', run.game),
      m('.video-up-next-details', details),
    ])
  }
}

class VideoScreenComponent {
  view(vnode) {
    const run = vnode.attrs.nextRuns[0];

    return m('.graphic .fullscreen', [
      m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.video-component-container', [
          m('.video-greenscreen'),
          m(UpNext, { nextRuns: vnode.attrs.nextRuns }),
        ]),
      ]),
      m(BarComponent, { total: vnode.attrs.total, barAnnouncementsRep: vnode.attrs.barAnnouncementsRep }),
    ]);
  }
}

NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => {
      return m(VideoScreenComponent, {
        total: Math.floor(replicants.total.value),
        backgroundModeRep: replicants.backgroundMode,
        nextRuns: nextRuns(replicants.run.value, replicants.runArray.value),
        barAnnouncementsRep: replicants.barAnnouncementsRep,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});
