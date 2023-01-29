import m from 'mithril';
import { get } from 'lodash';

import '../common.css'
import './sixteenNine.css';

import TimerComponent from '../timer/timer.js';
import RunnersComponent from '../runners/runners.js';
import CouchComponent from '../couch/couch.js';
import BeachBackground from '../beach/beach.js';
import BarComponent from '../bar/bar.js';
import { RunGameComponent, RunDetailsComponent, LogosComponent, CamsComponent } from '../common/common.js';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  timer: NodeCG.Replicant('timer', 'nodecg-speedcontrol'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
  camNum: NodeCG.Replicant('camnum', 'wasd'),
};

const sep = '/';

class SixteenNineComponent {
  view(vnode) {
    return m('.graphic .fullscreen', [
      m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.game'),
        m('.left', [
          m(CamsComponent, { camNumRep: vnode.attrs.camNumRep }),
          m(RunnersComponent, {
            players: get(vnode, 'attrs.run.teams[0].players'),
            customData: get(vnode, 'attrs.run.customData'),
          }),
          m(CouchComponent, { customData: get(vnode, 'attrs.run.customData') }),
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
      m(BarComponent, { total: vnode.attrs.total }),
    ]);
  }
}


NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => {
      return m(SixteenNineComponent, {
        run: replicants.run.value,
        time: replicants.timer.value.time,
        total: Math.floor(replicants.total.value),
        backgroundModeRep: replicants.backgroundMode,
        camNumRep: replicants.camNum,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});
