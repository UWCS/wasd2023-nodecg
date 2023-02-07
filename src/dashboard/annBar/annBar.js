import { result } from 'lodash';
import m from 'mithril';

import '../common.css';
import './annBar.css';

const defaultCTAs = [
  'Warwick\'s Awesome Speedruns & Demos 2023',
  'See the full schedule at warwickspeed.run/schedule',
  'WASD 2023 is raising money for SpecialEffect',
  'Donate now at warwickspeed.run/donate',
]

const barAnnouncementsRep = NodeCG.Replicant('barAnnouncements', 'wasd', {
  defaultValue: [...defaultCTAs], persistent: true
});

class AnnouncementsBar {
  view(vnode) {
    const annrep = vnode.attrs.barAnnouncementsRep;
    console.log(annrep)

    let result = [m('.ann-status', `Current count: ${annrep.value.length}`)]

    for (let i=0; i < annrep.value.length; i++) {
      result.push(m('.ann-controls', [
        m('input.ann-input', {
          value: annrep.value[i],
          oninput: (e) => { annrep.value[i] = e.target.value; },
        }),
        m('button.ann-button', { onclick: () => { annrep.value.splice(i, 1) } }, "-"),
        m('button.ann-button', { onclick: () => { [annrep.value[i-1], annrep.value[i]] = [annrep.value[i], annrep.value[i-1]] } }, "↑"),
        m('button.ann-button', { onclick: () => { [annrep.value[i+1], annrep.value[i]] = [annrep.value[i], annrep.value[i+1]] } }, "↓"),
      ]))
    }

    return m('.ann-container', [
      ...result,
      m('.ann-controls', [
        m('button.ann-button', { onclick: () => { annrep.value.push("") } }, "Add"),
        m('button.ann-button', { onclick: () => { annrep.value = defaultCTAs } }, "Reset"),
      ])
    ]);
  }
}

NodeCG.waitForReplicants(barAnnouncementsRep).then(() => {
  m.mount(document.body, {
    view: () => m(AnnouncementsBar, { barAnnouncementsRep: barAnnouncementsRep })
  });
});

barAnnouncementsRep.on('change', () => { m.redraw(); });
