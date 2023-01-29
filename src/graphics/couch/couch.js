import m from 'mithril';
import { get } from 'lodash';

import '../common.css'
import './couch.css';

class CouchRow {
  view(vnode) {
    const { name, pronouns } = vnode.attrs;

    if (!name) {
      return null;
    }

    return m('.couch-row', [
      m('.couch-mic-icon-multi', [
        m('.couch-mic-icon.light'),
        m('.couch-mic-icon.dark'),
      ]),
      m('.couch-person', name),
      m('.couch-pronouns', pronouns),
    ]);
  }
}

export default class CouchComponent {
  view(vnode) {
    const couch = [
      { name: get(vnode, 'attrs.customData.c1Name'), pronouns: get(vnode, 'attrs.customData.c1Pronouns') },
      { name: get(vnode, 'attrs.customData.c2Name'), pronouns: get(vnode, 'attrs.customData.c2Pronouns') },
      { name: get(vnode, 'attrs.customData.c3Name'), pronouns: get(vnode, 'attrs.customData.c3Pronouns') },
    ];

    const num = couch.filter(c => c.name)
    if (num == 0) return null;
    // const plural = num > 1;

    return m('.couch-container', [
      // m('.couch-label', plural ? 'Commentators' : 'Commentator'),
      ...couch.map((c) => m(CouchRow, c)),
    ]);
  }
}
