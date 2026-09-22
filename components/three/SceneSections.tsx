"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  CONTACT_CAM,
  PROCESS_CAM,
  SECTION_ORDER,
  applySectionKeyframe,
  findActiveSectionId,
} from "@/lib/scene-keyframes";
import { setProgress, setSceneTarget } from "@/lib/scene-store";
import { prefersReducedMotion } from "@/lib/motion";

export default function SceneSections() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const triggers: ScrollTrigger[] = [];

    triggers.push(
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setProgress(self.progress),
      }),
    );

    for (const id of SECTION_ORDER) {
      const element = document.getElementById(id);
      if (!element) continue;

      triggers.push(
        ScrollTrigger.create({
          trigger: element,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) applySectionKeyframe(id);
          },
        }),
      );
    }

    // Service-step rotation is driven by the pinned Services section itself.
    const processElement = document.getElementById("process");
    if (processElement) {
      triggers.push(
        ScrollTrigger.create({
          trigger: processElement,
          start: "top 55%",
          end: "bottom 55%",
          onUpdate: (self) => {
            if (!self.isActive) return;
            setSceneTarget({
              camZ: gsap.utils.interpolate(
                PROCESS_CAM.from,
                PROCESS_CAM.to,
                self.progress,
              ),
            });
          },
        }),
      );
    }

    const contactElement = document.getElementById("contact");
    if (contactElement) {
      triggers.push(
        ScrollTrigger.create({
          trigger: contactElement,
          start: "top 60%",
          end: "bottom 40%",
          onUpdate: (self) => {
            if (!self.isActive) return;
            setSceneTarget({
              camZ: gsap.utils.interpolate(
                CONTACT_CAM.from,
                CONTACT_CAM.to,
                self.progress,
              ),
            });
          },
        }),
      );
    }

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    const onLoad = () => ScrollTrigger.refresh();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        const active = findActiveSectionId();
        if (active) applySectionKeyframe(active);
      }, 200);
    };

    const onOrientation = () => ScrollTrigger.refresh();

    window.addEventListener("load", onLoad);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}