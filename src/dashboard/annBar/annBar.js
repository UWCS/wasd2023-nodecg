import { result } from 'lodash';
import m from 'mithril';

import '../common.css';
import './annBar.css';

const barAnnouncementsRep = NodeCG.Replicant('barAnnouncements', 'wasd', {
  defaultValue: [
    'Warwick\'s Awesome Speedruns & Demos 2023',
    'See the full schedule at warwickspeed.run/schedule',
    'WASD 2023 is raising money for SpecialEffect',
    'Donate now at warwickspeed.run/donate',
  ], persistent: true
});

class AnnouncementsBar {
  view(vnode) {
    const annrep = vnode.attrs.barAnnouncementsRep;

    let result = [m('.ann-status', `Current count: ${annrep.length}`)]

    for (let i=0; i < annrep.value.length; i++) {
      result.push(m('.ann-controls', [
        m('input.ann-input', {
          type: 'text',
          value: annrep.value[i],
          oninput: (e) => { annrep.value[i] = e.value },
        }),
        m('button.ann-button', { onclick: () => { annrep.value.splice(i, 1) } }, "-"),
      ]))
    }

    return m('.ann-container', [
      m('.ann-status', `Current count: ${annrep.length}`),
      ...result,
      m('button.ann-button', { onclick: () => { annrep.value.push("") } }, "Add"),
    ]);
  }
}

NodeCG.waitForReplicants(barAnnouncementsRep).then(() => {
  m.mount(document.body, {
    view: () => m(AnnouncementsBar, { barAnnouncementsRep: barAnnouncementsRep })
  });
});

barAnnouncementsRep.on('change', () => { m.redraw(); });
