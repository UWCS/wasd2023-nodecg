import m from 'mithril';
import gsap from 'gsap';
import { get } from 'lodash';
import { LogosComponent, setupNotifs, toast } from '../common/common.js';

import '../common.css';
import './break.css';

// import BeachBackground from '../beach/beach.js';
import CurrentSongComponent from '../currentSong/currentSong.js';
import BarComponent from '../bar/bar.js';
import { nextRuns } from '../nextRuns/nextRuns.js';
import { BreakMultiBox, Run } from './break-pages.js';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  runArray: NodeCG.Replicant('runDataArray', 'nodecg-speedcontrol'),
  currentSong: NodeCG.Replicant('currentSong', 'ncg-spotify'),
  countdown: NodeCG.Replicant('countdown', 'wasd'),
  // backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  challenges: NodeCG.Replicant('challenges', 'nodecg-tiltify'),
  polls: NodeCG.Replicant('donationpolls', 'nodecg-tiltify'),
  donations: NodeCG.Replicant('donations', 'nodecg-tiltify'),
  milestones: NodeCG.Replicant('milestones', 'nodecg-tiltify'),
  barAnnouncementsRep: NodeCG.Replicant('barAnnouncements', 'wasd'),
};

class BreakComponent {
  view(vnode) {
    return m('.graphic .fullscreen #fullscreen', [
      // m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.break-container', [
          m('.break-left', [
            // m("button", { onclick: () => toast(`Jeff donated £10`) }, "Toast"),
            m(LogosComponent),
            m('.break-h-space'),
            m('.countdown-container', [
              m('.countdown-label', 'BACK SOON'),
              m('.countdown-time', vnode.attrs.countdown.display),
            ]),
            m(CurrentSongComponent, vnode.attrs.currentSong),
          ]),
          m('.break-v-space'),
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
              milestones: vnode.attrs.milestones,
              total: vnode.attrs.total,
            }),
          ]),
        ]),
      ]),
      m(BarComponent, {
        total: vnode.attrs.total,
        nextRuns: vnode.attrs.nextRuns,
        incentives: vnode.attrs.incentives,
        polls: vnode.attrs.polls,
        barAnnouncementsRep: vnode.attrs.barAnnouncementsRep,
      }),
    ]);
  }
}

NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => {
      return m(BreakComponent, {
        currentSong: replicants.currentSong.value,
        total: Math.floor(replicants.total.value),
        countdown: replicants.countdown.value,
        // backgroundModeRep: replicants.backgroundMode,
        nextRuns: nextRuns(replicants.run.value, replicants.runArray.value),
        incentives: replicants.challenges.value,
        polls: replicants.polls.value,
        milestones: replicants.milestones.value,
        barAnnouncementsRep: replicants.barAnnouncementsRep,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});

replicants.polls.on("change", function (oldState, newState) { console.log("Poll change from", oldState, " to ", newState) });

setupNotifs(replicants.donations);