import m from 'mithril';

import '../common.css';
import './cam2.css';

const camNumRep = NodeCG.Replicant('camnum', 'wasd', { defaultValue: 1 });

class CamControl {
  view(vnode) {
    const rep = vnode.attrs.camNumRep;

    return m('.cam2-container', [
      m('.cam2-status', `Current mode: ${rep.value}`),
      m('.cam2-controls', [
        m('button.cam2-button', {onclick: () => { rep.value += 1; } }, 'Add'),
        m('button.cam2-button', {onclick: () => { rep.value -= 1; } }, 'Remove'),
      ]),
    ]);
  }
}

NodeCG.waitForReplicants(camNumRep).then(() => {
  m.mount(document.body, {
    view: () => m(CamControl, { camNumRep: camNumRep })
  });
});

camNumRep.on('change', () => { m.redraw(); });
