import fitty from 'fitty';
import m from 'mithril';
import { get } from 'lodash';
import gsap from 'gsap';

export class RunGameComponent {
    view(vnode) {
        return m('.run-game', String(vnode.attrs.game));
    }

    onupdate(vnode) {
        fitty(vnode.dom, { maxSize: vnode.attrs.size || 58, multiline: false });
    }

    oncreate(vnode) {
        fitty(vnode.dom, { maxSize: vnode.attrs.size || 58, multiline: false });
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
        fitty(vnode.dom, { maxSize: vnode.attrs.size || 23, multiline: false });
    }

    oncreate(vnode) {
        fitty(vnode.dom, { maxSize: vnode.attrs.size || 23, multiline: false });
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
            logos.forEach((logo) => logo.style = "opacity: 1.0;");
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
                tl.to({}, vnode.attrs.hold || 5, {});
                tl.to(logo, { opacity: 0 });
            });

            vnode.dom.classList.add("stack");
            this.anim = tl;
        }
    }

    onupdate(vnode) {
        const w = vnode.dom.offsetWidth;
        const h = vnode.dom.offsetHeight;

        if (h < 100) gsap.set(".logo-multi", { display: "none" });
        else gsap.set(".logo-multi", { display: "flex" });
        
        if (h > 400) {
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


export class CamsComponent {
    view(vnode) {
        return m("#cameras", [
            m(".cam.cam1"),
            m(".cam.cam2"),
            m(".cam.cam3"),
            m(".cam.cam4"),
        ])
    }

    update_cams_vis(n) {
        if (n !== undefined) {
            gsap.set('.cam.cam1', { hidden: n <= 0});
            gsap.set('.cam.cam2', { hidden: n <= 1});
            gsap.set('.cam.cam3', { hidden: n <= 2});
            gsap.set('.cam.cam4', { hidden: n <= 3});
        } else n = 1;
    }

    update_cams_asp(arr) {
        if (arr !== undefined) {
            gsap.set('.cam.cam1', { "aspect-ratio": arr[0]});
            gsap.set('.cam.cam2', { "aspect-ratio": arr[1]});
            gsap.set('.cam.cam3', { "aspect-ratio": arr[2]});
            gsap.set('.cam.cam4', { "aspect-ratio": arr[3]});
        } else arr = ["16/9", "16/9", "16/9", "16/9"];
    }

    oncreate(vnode) {
        const rep = vnode.attrs.camNumRep;

        rep.on('change', (newMode, oldMode) => {
            this.update_cams_vis(newMode);
        });

        const rep2 = vnode.attrs.camSizesRep;

        rep2.on('change', (newMode, oldMode) => {
            this.update_cams_asp(newMode);
        });
    }
}


export class ScrollText {
    view(vnode) {
      return m(vnode.attrs.cls, vnode.attrs.txt);
    }
  
    onremove(vnode) {
      if (this.scroll) {
        this.scroll.kill();
      }
    }
  
    oncreate(vnode) {
      const parentPadding = 2 * parseInt(window.getComputedStyle(vnode.dom.parentElement).paddingLeft, 10);
      const parentWidth = vnode.dom.parentElement.clientWidth - parentPadding;
  
      const textWidth = vnode.dom.clientWidth;
  
      if (parentWidth >= textWidth) {
        return;
      }
  
      const distance = textWidth - parentWidth;
      const speed = 24; // pixels per second
  
      const tl = gsap.timeline({ repeat: -1 });
  
      tl.to({}, 3, {});
      tl.to(vnode.dom, {
        x: `-=${distance}`,
        ease: 'none',
        duration: distance / speed,
      });
      tl.to({}, 2, {});
      tl.to(vnode.dom, { x: 0 });
  
      this.scroll = tl;
    }
  }