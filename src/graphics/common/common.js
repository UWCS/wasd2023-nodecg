import fitty from 'fitty';
import m from 'mithril';
import { get } from 'lodash';
import gsap from 'gsap';

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
        
        const contents = [system, release, category].filter(i => i).join(`  ${sep}  `);
        return m('.run-details-row', contents);
    }

    onupdate(vnode) {
        fitty(vnode.dom, { maxSize: 23, multiline: false });
    }

    oncreate(vnode) {
        fitty(vnode.dom, { maxSize: 23, multiline: false });
    }
}

export class LogosComponent {
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

    end(vnode) {
        if (this.anim) {
            this.anim.kill();
            const logos = Array.from(vnode.dom.children);
            logos.forEach((logo) => logo.style="opacity: 1.0;");
            vnode.dom.classList.remove("stack");
            this.anim = undefined;
        }
    }

    start(vnode) {
        if (!this.anim) {
            const logos = Array.from(vnode.dom.children);
            const tl = gsap.timeline({ repeat: -1 });

            logos.forEach((logo) => {
                tl.from(logo, { opacity: 0 });
                tl.to({}, vnode.attrs.hold || 2, {});
                tl.to(logo, { opacity: 0 });
            });

            vnode.dom.classList.add("stack");
            this.anim = tl;
        }
    }

    onupdate(vnode) {
        const w = vnode.dom.offsetWidth;
        const h = vnode.dom.offsetHeight;
        if (h * 1.0 / w > 1.25) {
            this.end(vnode);
        } else {
            this.start(vnode);
        }
    }

    oncreate(vnode) {
        this.start(vnode);
    }

    onremove(vnode) {
        this.end(vnode);
    }
}