import m from 'mithril';

import '../common.css';
import './cam2.css';

const camNumRep = NodeCG.Replicant('camNum', 'wasd', { defaultValue: 1, persistent: false });
const camSizesRep = NodeCG.Replicant('camSizes', 'wasd', { defaultValue: ["16/9", "16/9", "16/9", "16/9"], persistent: false  });

class CamControl {
  view(vnode) {
    const numrep = vnode.attrs.camNumRep;
    const rep = vnode.attrs.camSizesRep;

    const row = (i) => {
      if (numrep.value <= i) return null;
      
      return m('.cam2-controls', [
        m('button.cam2-button', { disabled: numrep.value <= i || rep.value[i] == "16/9", onclick: () => { rep.value[i] = "16/9"; } }, '16:9'),
        m('button.cam2-button', { disabled: numrep.value <= i || rep.value[i] == "4/3",  onclick: () => { rep.value[i] = "4/3"; } }, '4:3'),
        m('button.cam2-button', { disabled: numrep.value <= i || rep.value[i] == "1/1",  onclick: () => { rep.value[i] = "1/1"; } }, '1:1'),
        m('button.cam2-button', { disabled: numrep.value <= i || rep.value[i] == "3/4",  onclick: () => { rep.value[i] = "3/4"; } }, '3:4'),
      ])
    };

    return m('.cam2-container', [
      m('.cam2-status', `Current count: ${numrep.value}`),
      m('.cam2-controls', [
        m('button.cam2-button', {disabled: numrep.value >= 4, onclick: () => { numrep.value += 1 } }, 'Add'),
        m('button.cam2-button', {disabled: numrep.value <= 0, onclick: () => { numrep.value -= 1 } }, 'Remove'),
      ]),
      row(0), row(1), row(2), row(3)
    ]);
  }
}

NodeCG.waitForReplicants(camSizesRep, camNumRep).then(() => {
  m.mount(document.body, {
    view: () => m(CamControl, { camSizesRep: camSizesRep, camNumRep: camNumRep })
  });
});

camSizesRep.on('change', () => { m.redraw(); });
camNumRep.on('change', () => { m.redraw(); });
