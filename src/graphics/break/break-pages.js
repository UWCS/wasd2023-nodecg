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
    const incentives = vnode.attrs.incentives || []
    const incentive_objs = incentives.filter(i => i.active)
      .sort((left, right) => left.endsAt < right.endsAt) // tmp
      .map((i) => m(Incentive, { incentive: i, key: i.id }));

    return m('.break-page-container .break-incentives', [
      m('.break-right-label', 'Donation Incentives'),
      m('.break-h-space'),
      m('.break-incentives-list', ...incentive_objs),
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
    const polls = vnode.attrs.polls || []
    const poll_objs = polls.filter(i => i.active)
      .sort((left, right) => left.updatedAt < right.updatedAt) // tmp
      .map((p) => m(Poll, { poll: p, key: p.id }));

    return m('.break-page-container .break-polls', [
      m('.break-right-label', 'Donation Polls'),
      m('.break-right-label .light', 'Unfortunately, Tiltify broke their poll API a few days ago, not much we can do, soz :/'),
      m('.break-h-space'),
      m('.break-incentives-list', ...poll_objs),
    ]);
  }
}

class Milestone {
  view(vnode) {
    const milestone = vnode.attrs.milestone;
    const total = vnode.attrs.total || 0;
    const content = total > milestone.amount ? `Milestone Hit! (£${milestone.amount}/${milestone.amount})` : `£${total} / £${milestone.amount}`;
    return m('.break-incentive-container', [
      m('.break-incentive-name', milestone.name),
      m('.break-incentive-bar', [
        m('.break-incentive-progress'),
        m('.break-incentive-amount', content),
      ]),
    ]);
  }

  onupdate(vnode) {
    const bar = vnode.dom.getElementsByClassName("break-incentive-progress")[0];

    const current = Number(vnode.attrs.total);
    const max = Number(vnode.attrs.milestone.amount);

    const width = Math.min(((current / max) * 100), 100);

    gsap.to(bar, { width: `${width}%`, ease: 'expo.out', duration: 3 });

    fitty(vnode.dom.children[0], { maxSize: vnode.attrs.size || 30, multiline: false });
  }

  oncreate(vnode) {
      fitty(vnode.dom.children[0], { maxSize: vnode.attrs.size || 30, multiline: false });
  }
}

function filterMS(mss, total) {
  // Display latest passed milestone and subsequent
  const ind = mss.findIndex((m) => m.amount >= total);
  if (ind <= 0) return mss;
  return mss.slice(ind-1);
}

export class Milestones {
  view(vnode) {
    const milestones = vnode.attrs.milestones ? [...vnode.attrs.milestones] : [];
    milestones.sort((left, right) => { left.amount < right.amount } );
    const sortedMS = filterMS(milestones, vnode.attrs.total);
    const ms_objs = sortedMS.map((i) => m(Milestone, { milestone: i, key: i.id, total: vnode.attrs.total }));

    return m('.break-page-container .break-incentives', [
      m('.break-right-label', 'Donation Milestones'),
      m('.break-h-space'),
      m('.break-incentives-list', ...ms_objs),
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
        m('.break-page-container .break-later-on', [
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
      m('.break-multibox-item', [
        m(Milestones, { milestones: vnode.attrs.milestones, total: vnode.attrs.total }),
      ]),
      m('.break-multibox-item', [
        m(".break-page-container .break-desc", [
          m('.break-right-label', 'WASD 2023 Description'),
          m('.break-h-space'),
          m(".break-next-run-container", [
          m("p.light", "Started in 2016, Warwick's Awesome Speedruns and Demos (WASD) is a 2-day speedrunning event held annually at the University of Warwick. It is the largest student-run speedrunning event in the UK. "),
          m("p.light", "Donations to the event are in support of SpecialEffect, a wonderful UK-based charity whose mission is to put fun and inclusion back into the lives of people with physical disabilities, by helping them to play video games. To date, the WASD events have raised over £6,000 for SpecialEffect!"),
          m("p.light", "Find more information at warwickspeed.run or find us in Warwick Uni's SU Atrium or Twitch.")
        ])]),
      ]),
    ]);
  }


  oncreate(vnode) {
    const boxes = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1, paused: true });

    const hold = 7;

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