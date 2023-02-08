import m from 'mithril';
import gsap from 'gsap';
import { get } from 'lodash';

import '../common.css';
import './break.css';

import BeachBackground from '../beach/beach.js';
import CurrentSongComponent from '../currentSong/currentSong.js';
import BarComponent from '../bar/bar.js';
import { nextRuns } from '../nextRuns/nextRuns.js';
import { LogosComponent } from '../common/common.js';


const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  runArray: NodeCG.Replicant('runDataArray', 'nodecg-speedcontrol'),
  currentSong: NodeCG.Replicant('currentSong', 'ncg-spotify'),
  countdown: NodeCG.Replicant('countdown', 'wasd'),
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  challenges: NodeCG.Replicant('challenges', 'nodecg-tiltify'),
  polls: NodeCG.Replicant('donationpolls', 'nodecg-tiltify'),
  barAnnouncementsRep: NodeCG.Replicant('barAnnouncements', 'wasd'),
};

class Incentive {
  view(vnode) {
    const { name, amount, totalAmountRaised } = vnode.attrs.incentive;

    return m('.break-incentive-container', [
      m('.break-incentive-name', name),
      m('.break-incentive-bar', [
        m('.break-incentive-progress'),
        m('.break-incentive-amount', `£${totalAmountRaised} / £${amount}`),
      ]),
    ]);
  }

  onupdate(vnode) {
    const bar = vnode.dom.children[1].children[0];

    const current = Number(vnode.attrs.incentive.totalAmountRaised);
    const max = Number(vnode.attrs.incentive.amount);

    const width = Math.min(((current / max) * 100), 100);

    gsap.to(bar, { width: `${width}%`, ease: 'expo.out', duration: 3 });
  }
}

class PollOption {
  view(vnode) {
    let option = vnode.attrs.option;
    return m('.break-option-container', [
      m('.break-poll-option', option.name),
      m('.break-poll-bar', [
        m('.break-poll-progress'),
        m('.break-poll-amount', `£${option.totalAmountRaised}`),
      ]),
    ])
  }

  onupdate(vnode) {
    const bar = vnode.dom.children[1].children[1].children[0];

    const current = Number(vnode.attrs.option.totalAmountRaised);
    const max = Number(vnode.attrs.max);

    const width = Math.min(((current / max) * 100), 100);

    gsap.to(bar, { width: `${width}%`, ease: 'expo.out', duration: 3 });
  }
}

class Poll {
  view(vnode) {
    console.log(vnode.attrs.poll);
    const poll = vnode.attrs.poll;

    let max = 1;
    for (let o in poll.options) {
      max += o;
    }
    // .sort((left, right) => left.totalAmountRaised > right.totalAmountRaised)
    const options = poll.options.map((o) => m(PollOption, { poll: poll, option: o, max: max }));

    return m('.break-poll-container', [
      m('.break-poll-name', poll.name),
      ...options
    ]);
  }
}

class Incentives {
  view(vnode) {
    const incentives = vnode.attrs.incentives.filter(i => i.active)
      .sort((left, right) => left.endsAt < right.endsAt) // tmp
      .map((i) => m(Incentive, { incentive: i, key: i.id }));

    const polls = vnode.attrs.polls.filter(i => i.active)
      .sort((left, right) => left.updatedAt < right.updatedAt) // tmp
      .map((p) => m(Poll, { poll: p, key: p.id }));

    return m('.break-incentives-container', [
      m('.break-h-space'),
      m('.break-right-label', 'Donation Incentives'),
      m('.break-h-space'),
      m('.break-incentives-list', ...incentives, ...polls),
    ]);
  }
}

class BreakMultiBox {
  view(vnode) {
    return m('.break-multibox', [
      m('.break-multibox-item', [
        m('.break-later-on', [
          m('.break-h-space'),
          m('.break-right-label', 'Later On'),
          m('.break-h-space'),
          (
            (vnode.attrs.nextRuns.length < 2)
              ? m('.break-next-run-game', 'NO RUNS!')
              : vnode.attrs.nextRuns.slice(1).map(run => m(Run, { run: run }))
          ),
        ]),
      ]),
      m('.break-multibox-item', [
        m(Incentives, { incentives: vnode.attrs.incentives, polls: vnode.attrs.polls }),
      ]),
    ]);
  }


  oncreate(vnode) {
    const boxes = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1, paused: true });

    const hold = 2;

    boxes.forEach((box) => {
      gsap.set(box, { opacity: 0 });
      tl.to(box, { opacity: 1 });
      tl.to({}, hold, {});
      tl.to(box, { opacity: 0 });
      tl
    });

    this.anim = tl;

    tl.play();
  }

  onremove(vnode) {
    if (this.anim) {
      this.anim.kill();
    }
  }
}

class Run {
  view(vnode) {
    const run = vnode.attrs.run;
    const details = [
      get(run, 'category', ''),
      get(run, 'teams[0].players', []).map(p => p.name).join(', '),
      get(run, 'system', ''),
      get(run, 'estimate'),
    ].filter(e => e).join(' / ');

    return m('.break-next-run-container', [
      m('.break-next-run-bg'),
      m('.break-next-run-game', vnode.attrs.run.game),
      m('.break-next-run-details', details)
    ]);
  }
}

class BreakComponent {
  view(vnode) {
    return m('.graphic .fullscreen', [
      m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.break-container', [
          m('.break-left', [
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
            m('.break-h-space'),
            m('.break-right-label', 'Coming Up Next'),
            m('.break-h-space'),
            ((vnode.attrs.nextRuns.length === 0)
              ? m('.break-next-run-game', 'NO RUNS!')
              : m(Run, { run: vnode.attrs.nextRuns[0] })),
            m(BreakMultiBox, {
              nextRuns: vnode.attrs.nextRuns,
              incentives: vnode.attrs.incentives,
              polls: vnode.attrs.polls,
              dayAmount: vnode.attrs.dayAmount,
              nightAmount: vnode.attrs.nightAmount,
            }),
          ]),
        ]),
      ]),
      m(BarComponent, { total: vnode.attrs.total, barAnnouncementsRep: vnode.attrs.barAnnouncementsRep }),
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
        backgroundModeRep: replicants.backgroundMode,
        nextRuns: nextRuns(replicants.run.value, replicants.runArray.value),
        incentives: replicants.challenges.value,
        polls: replicants.polls.value,
        dayAmount: Math.floor(get(replicants.polls, 'value[1].options[0].totalAmountRaised', 0)),
        nightAmount: Math.floor(get(replicants.polls, 'value[1].options[1].totalAmountRaised', 0)),
        barAnnouncementsRep: replicants.barAnnouncementsRep,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});
