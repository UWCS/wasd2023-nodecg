import fitty from 'fitty';
import m from 'mithril';
import { get } from 'lodash';

export class RunGameComponent {
    view(vnode) {
        return m('.run-game', String(vnode.attrs.game));
    }

    onupdate(vnode) {
        fitty(vnode.dom, { maxSize: 58, multiline: false });
    }

    oncreate(vnode) {
        fitty(vnode.dom, { maxSize: 58, multiline: false });
    }
}

export class RunDetailsComponent {
    view(vnode) {
        const system = get(vnode, 'attrs.run.system');
        const release = get(vnode, 'attrs.run.release');
        const category = get(vnode, 'attrs.run.category');
        const sep = '/';

        return m('.run-details-row', [system, release, category].join(`  ${sep}  `));
    }

    onupdate(vnode) {
        fitty(vnode.dom, { maxSize: 23, multiline: false });
    }

    oncreate(vnode) {
        fitty(vnode.dom, { maxSize: 23, multiline: false });
    }
}


export class LogosStack {
    view() {
        return m('.logos', [
            m('.logo-multi', [
                m('.logo .wasd-light'),
                m('.logo .wasd-dark'),
            ]),
            m('.logo-multi', [
                m('.logo .special-effect-white'),
                m('.logo .special-effect-orange'),
            ]),
        ]);
    }
}

export class LogosRotate {
    view() {
        return m('.logos', [
            m('.logo-multi', [
                m('.logo .wasd-light'),
                m('.logo .wasd-dark'),
            ]),
            m('.logo-multi', [
                m('.logo .special-effect-white'),
                m('.logo .special-effect-orange'),
            ]),
        ]);
    }

    onremove(vnode) {
        if (this.anim) {
            this.anim.kill();
        }
    }

    oncreate(vnode) {
        const logos = Array.from(vnode.dom.children);

        const tl = gsap.timeline({ repeat: -1 });

        logos.forEach((logo) => {
            tl.from(logo, { opacity: 0 });
            tl.to({}, vnode.attrs.hold || 2, {});
            tl.to(logo, { opacity: 0 });
        });

        this.anim = tl;
    }
}