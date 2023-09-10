import gsap from "gsap";
import { Vector3 } from "three";

export const scrollAnimation = (position: Vector3, target: Vector3, onUpdate: () => void) => {
    const tl = gsap.timeline();

    tl.to(position, {
        x: -3.38,
        y: -10.74,
        z: -5.93,
        scrollTrigger: {
            trigger: '.sound-section',
            start: "top bottom",
            end: "top top",
            scrub: 2,
            immediateRender: false
        },
        onUpdate
    })
    .to(target, {
        x: 1.52,
        y: 0.77,
        z: -1.08,
        scrollTrigger: {
            trigger: '.sound-section',
            start: "top bottom",
            end: "top top",
            scrub: 2,
            immediateRender: false
        },
    })
    .to('.jumbotron-section', {
        opacity: 0,
        scrollTrigger: {
            trigger: '.sound-section',
            start: "top bottom",
            end: "top top",
            scrub: 2,
            immediateRender: false
        },
    })
}