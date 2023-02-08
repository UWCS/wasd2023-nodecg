import m from 'mithril';
import gsap from 'gsap';
import fitty from 'fitty';

import { RunGameComponent, RunDetailsComponent } from '../common/common.js';

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
    const bar = vnode.dom.getElementsByClassName("break-incentive-progress")[0];

    const current = Number(vnode.attrs.incentive.totalAmountRaised);
    const max = Number(vnode.attrs.incentive.amount);

    const width = Math.min(((current / max) * 100), 100);

    gsap.to(bar, { width: `${width}%`, ease: 'expo.out', duration: 3 });

    fitty(vnode.dom.children[0], { maxSize: vnode.attrs.size || 30, multiline: false });
  }

  oncreate(vnode) {
      fitty(vnode.dom.children[0], { maxSize: vnode.attrs.size || 30, multiline: false });
  }
}

export class Incentives {
  view(vnode) {
    const incentives = vnode.attrs.incentives.filter(i => i.active)
      .sort((left, right) => left.endsAt < right.endsAt) // tmp
      .map((i) => m(Incentive, { incentive: i, key: i.id }));

    return m('.break-incentives-container', [
      m('.break-right-label', 'Donation Incentives'),
      m('.break-h-space'),
      m('.break-incentives-list', ...incentives),
    ]);
  }
}



class PollOption {
  view(vnode) {
    let option = vnode.attrs.option;
    let percent = vnode.attrs.max == 0 ? 0.0 : Math.round(100 * Number(option.totalAmountRaised) / vnode.attrs.max);
    return m('.break-option-container', [
      m('.break-poll-option', option.name),
      m('.break-poll-bar', [
        m('.break-poll-progress'),
        m('.break-poll-amount', `${percent}% (£${Number(option.totalAmountRaised)})`),
      ]),
    ])
  }

  onupdate(vnode) {
    const bar = vnode.dom.getElementsByClassName("break-poll-progress")[0];

    const current = Number(vnode.attrs.option.totalAmountRaised);
    const max = vnode.attrs.max;

    const width = vnode.attrs.max == 0 ? 0 : Math.min(((current / max) * 100), 100);

    gsap.to(bar, { width: `${width}%`, ease: 'expo.out', duration: 3 });
  }
}

class Poll {
  view(vnode) {
    const poll = vnode.attrs.poll;

    let max = 0.0;
    for (let o of poll.options) {
      max += Number(o.totalAmountRaised);
    }
    // .sort((left, right) => left.totalAmountRaised > right.totalAmountRaised)
    const options = poll.options.map((o) => m(PollOption, { poll: poll, option: o, max: max }));

    return m('.break-poll-container', [
      m('.break-poll-name', poll.name),
      ...options
    ]);
  }

  onupdate(vnode) {
      fitty(vnode.dom.children[0], { maxSize: vnode.attrs.size || 30, multiline: false });
  }

  oncreate(vnode) {
      fitty(vnode.dom.children[0], { maxSize: vnode.attrs.size || 30, multiline: false });
  }
}

export class Polls {
  view(vnode) {
    const polls = vnode.attrs.polls.filter(i => i.active)
      .sort((left, right) => left.updatedAt < right.updatedAt) // tmp
      .map((p) => m(Poll, { poll: p, key: p.id }));

    return m('.break-incentives-container', [
      m('.break-right-label', 'Donation Polls'),
      m('.break-h-space'),
      m('.break-incentives-list', ...polls),
    ]);
  }
}

export class Run {
  view(vnode) {
    return m('.break-next-run-container', [
      m(RunGameComponent, { game: vnode.attrs.run.game, size: 40 }),
      m(RunDetailsComponent, { run: vnode.attrs.run, size: 24, multiline: vnode.attrs.multiline, full: true }),
    ]);
  }
}

export class BreakMultiBox {
  view(vnode) {
    return m('.break-multibox', [
      m('.break-multibox-item', [
        m('.break-later-on', [
          m('.break-right-label', 'Later On'),
          m('.break-h-space'),
          (
            (vnode.attrs.nextRuns.length < 2)
              ? m('.break-next-run-game', 'That\'s All!')
              : vnode.attrs.nextRuns.slice(1).map(run => m(Run, { run: run, multiline: vnode.attrs.multiline_games }))
          ),
        ]),
      ]),
      m('.break-multibox-item', [
        m(Incentives, { incentives: vnode.attrs.incentives }),
      ]),
      m('.break-multibox-item', [
        m(Polls, { polls: vnode.attrs.polls }),
      ]),
    ]);
  }


  oncreate(vnode) {
    const boxes = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1, paused: true });

    const hold = 10;

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