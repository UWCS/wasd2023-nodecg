import m from 'mithril';
import { get } from 'lodash';
import { RunGameComponent, RunDetailsComponent, LogosComponent, CamsComponent, setupNotifs, toast } from '../common/common.js';

import '../common.css'
import './race.css';

import TimerComponent from '../timer/timer.js';
import RunnersComponent from '../runners/runners.js';
import CommsComponent from '../comms/comms.js';
// import BeachBackground from '../beach/beach.js';
import BarComponent from '../bar/bar.js';
import { nextRuns } from '../nextRuns/nextRuns.js';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  runArray: NodeCG.Replicant('runDataArray', 'nodecg-speedcontrol'),
  timer: NodeCG.Replicant('timer', 'nodecg-speedcontrol'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  donations: NodeCG.Replicant('donations', 'nodecg-tiltify'),
  // backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
  camSizesRep: NodeCG.Replicant('camSizes', 'wasd'),
  camNumRep: NodeCG.Replicant('camNum', 'wasd'),
  barAnnouncementsRep: NodeCG.Replicant('barAnnouncements', 'wasd'),
};

class RaceComponent {
  view(vnode) {
    return m('.graphic .fullscreen #fullscreen', [
      // m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.game'),
        m('.game .game2'),
        m('.game .fakecam1'),
        m('.game .fakecam2'),
        m(RunnersComponent, {
          players: get(vnode, 'attrs.run.teams[0].players'),
          customData: get(vnode, 'attrs.run.customData'),
        }),
        m(".run2", [
          m(RunnersComponent, {
            players: get(vnode, 'attrs.run.teams[1].players'),
            customData: get(vnode, 'attrs.run.customData'),
          })]),
        m('.left', [
          // m("button", { onclick: () => toast(`Jeff donated £10`) }, "Toast"),
          // m(CamsComponent, { camSizesRep: vnode.attrs.camSizesRep, camNumRep: vnode.attrs.camNumRep }),
          // m(RunnersComponent, {
          //   players: get(vnode, 'attrs.run.teams[0].players'),
          //   customData: get(vnode, 'attrs.run.customData'),
          // }),
          // m(CommsComponent, { customData: get(vnode, 'attrs.run.customData') }),
          m(LogosComponent),
        ]),
        m('.bottom',[
          m('.run-details', [
            m(RunGameComponent, { game: get(vnode, 'attrs.run.game') }),
            m(RunDetailsComponent, { run: get(vnode, 'attrs.run') }),
          ]),
          m('.run-timing', [
            m(TimerComponent, { time: vnode.attrs.time }),
            m('.estimate', `Estimate: ${get(vnode, 'attrs.run.estimate')}`),
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
      return m(RaceComponent, {
        run: replicants.run.value,
        time: replicants.timer.value.time,
        nextRuns: nextRuns(replicants.run.value, replicants.runArray.value),
        total: Math.floor(replicants.total.value),
        // backgroundModeRep: replicants.backgroundMode,
        camSizesRep: replicants.camSizesRep,
        camNumRep: replicants.camNumRep,
        barAnnouncementsRep: replicants.barAnnouncementsRep,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});

setupNotifs(replicants.donations);