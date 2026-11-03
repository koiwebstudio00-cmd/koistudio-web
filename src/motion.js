/* Progressive motion: the complete site remains visible without GSAP/JavaScript. */
(() => {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  const initialize = () => {
    try {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const heroLines = document.querySelectorAll('.title-line');
        if (heroLines.length) {
          gsap.from(heroLines, { y:28, duration:1, stagger:.12, ease:'power3.out', clearProps:'transform' });
          gsap.from('.hero-pill, .hero--center .hero-actions, .hero-disciplines', { y:18, opacity:0, duration:.9, stagger:.1, ease:'power3.out', clearProps:'transform,opacity' });
        }
        gsap.to('.scroll-progress', {
          scaleX:1, ease:'none', scrollTrigger:{ start:0, end:'max', scrub:true }
        });

        // Each element enters once; typography and links are never rebuilt or split.
        gsap.utils.toArray('.studio-copy, .section-heading, .service, .faq details, .client-card').forEach((element, index) => {
          gsap.from(element, {
            y:32, opacity:0, duration:.7, ease:'power2.out',
            delay:element.matches('.service') ? (index % 3) * .08 : 0,
            clearProps:'transform,opacity,visibility',
            scrollTrigger:{ trigger:element, start:'top 92%', once:true }
          });
        });
        gsap.utils.toArray('.project-art').forEach(element => {
          gsap.from(element, { y:35, duration:.9, ease:'power3.out', clearProps:'transform', scrollTrigger:{trigger:element,start:'top 94%',once:true} });
        });

        const journey = document.querySelector('.process-journey');
        if (journey) {
          gsap.to('.journey-track > span', { scaleY:1, ease:'none', scrollTrigger:{trigger:journey,start:'top 65%',end:'bottom 65%',scrub:.35} });
          document.querySelectorAll('.steps li').forEach(step => {
            ScrollTrigger.create({trigger:step,start:'top 65%',end:'bottom 65%',toggleClass:'is-current'});
          });
        }
        const cta = document.querySelector('.cta-section');
        if (cta) gsap.from('.cta-arrow', { y:55, rotation:-16, ease:'none', scrollTrigger:{trigger:cta,start:'top bottom',end:'bottom center',scrub:1} });
        if (document.querySelector('.flow-demo')) {
          gsap.from('.flow-draw', {strokeDashoffset:1,ease:'none',scrollTrigger:{trigger:'.flow-demo',start:'top 75%',end:'bottom 45%',scrub:.6}});
          gsap.from('.flow-node', {y:25,opacity:.3,stagger:.18,duration:.75,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:'.flow-demo',start:'top 82%',once:true}});
          gsap.from('.flow-node-core > svg', {rotation:-90,scale:.7,ease:'none',scrollTrigger:{trigger:'.flow-demo',start:'top bottom',end:'bottom center',scrub:1}});
        }
        if (document.querySelector('.statement-track')) {
          gsap.to('.statement-track', {x:()=>-Math.max(0,document.querySelector('.statement-track').scrollWidth-innerWidth+40),ease:'none',scrollTrigger:{trigger:'.scroll-statement',start:'top bottom',end:'bottom top',scrub:1,invalidateOnRefresh:true}});
          gsap.to('.statement-track svg', {rotation:130,ease:'none',scrollTrigger:{trigger:'.scroll-statement',start:'top bottom',end:'bottom top',scrub:1}});
        }
        gsap.utils.toArray('.service-top > svg').forEach(svg=>gsap.from(svg,{rotation:-35,scale:.65,duration:.8,ease:'back.out(1.5)',clearProps:'transform',scrollTrigger:{trigger:svg,start:'top 90%',once:true}}));
        return () => document.querySelectorAll('.is-current').forEach(el => el.classList.remove('is-current'));
      });

      // Larger screens get subtle scroll-linked depth; touch screens keep normal flow.
      media.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
        if (document.querySelector('.hero--center')) {
          gsap.to('.hero--center .hero-copy', {y:85,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
          gsap.to('.glow-one', {scale:1.5,y:-70,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.4}});
          gsap.to('.orbit-one', {rotation:12,y:-55,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
          gsap.to('.orbit-two', {rotation:-12,y:-25,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.3}});
          gsap.to('.satellite-left', {y:-80,rotation:5,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.1}});
          gsap.to('.satellite-right', {y:-120,rotation:-5,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.5}});
        }
      });
      ScrollTrigger.refresh();
    } catch (error) {
      // Revert every style if a motion enhancement cannot initialize.
      media.revert();
      console.warn('Motion enhancements unavailable; static layout preserved.', error);
    }
  };
  if (document.fonts?.ready) document.fonts.ready.then(initialize);
  else initialize();
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => ScrollTrigger.refresh()));
  document.addEventListener('portfolio:filtered', () => {
    // Clear pending entrance transforms before a hidden card becomes visible again.
    document.querySelectorAll('[data-category]:not([hidden]) .project-art').forEach(el => {
      gsap.killTweensOf(el);
      gsap.set(el, {clearProps:'transform'});
    });
    ScrollTrigger.refresh();
  });
})();
