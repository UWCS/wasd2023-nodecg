import m from 'mithril';
import { get } from 'lodash';

import '../common.css'
import './comms.css';

class CommsRow {
  view(vnode) {
    const { name, pronouns } = vnode.attrs;

    if (!name) {
      return null;
    }

    return m('.comms-row', [
      m('.comms-mic-icon-multi', [
        m('.comms-mic-icon.light'),
        m('.comms-mic-icon.dark'),
      ]),
      m('.comms-person', name),
      m('.comms-pronouns', pronouns),
    ]);
  }
}

export default class CommsComponent {
  view(vnode) {
    const comms = [
      { name: get(vnode, 'attrs.customData.c1Name'), pronouns: get(vnode, 'attrs.customData.c1Pronouns') },
      { name: get(vnode, 'attrs.customData.c2Name'), pronouns: get(vnode, 'attrs.customData.c2Pronouns') },
      { name: get(vnode, 'attrs.customData.c3Name'), pronouns: get(vnode, 'attrs.customData.c3Pronouns') },
    ];

    const num = comms.filter(c => c.name)
    if (num == 0) return null;
    // const plural = num > 1;

    return m('.comms-container', [
      // m('.comms-label', plural ? 'Commentators' : 'Commentator'),
      ...comms.map((c) => m(CommsRow, c)),
    ]);
  }
}
