import gsap from "gsap"
import { ChipView } from "../scenes/sceneComponents/ChipView"
import { Main } from "../../main"
import { Container, Sprite, Text } from "pixi.js"
import { CardModel } from "../../model/CardModel"
import { CardView } from "../scenes/sceneComponents/CardView"
import { BevelFilter } from "pixi-filters"
import { Background } from "../scenes/sceneComponents/Background"

export class Animations {

    public static background = {
        unblur(bg: Background) {
            gsap.to(bg.blurFilter, {
                blur: 0,
                duration: 0.4,
                ease: 'sine.inOut',
            })
        },
    }

    public static initialLogo = {
        scale(logo: Sprite) {
            gsap.to(logo, {
                id: 'scaleLogo',
                pixi: {
                    scale: logo.scale.x + 0.05,
                },
                duration: 1,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            })
        },
        remove(logo: Sprite) {
            return new Promise(resolve => gsap.to(logo, {
                id: 'removeLogo',
                pixi: {
                    scale: 0,
                },
                duration: 0.5,
                ease: 'back.in',
                onComplete: resolve,
            }))
        }
    }

    public static chip = {
        place(chip: ChipView, index: number) {
            gsap.to(chip, {
                id: 'moveChip',
                pixi: {
                    positionX: Main.screenSize.width * 0.4,
                    positionY: Main.screenSize.height * 0.55 - 7 * index,
                    scaleX: chip.scale.x * 0.6,
                    scaleY: chip.scale.y * 0.5
                },
                duration: 0.5,
                ease: 'expo.inOut',
                onStart: () => Animations.chip.increaseBevelEffect(chip),
            })
        },
        increaseBevelEffect(chip: ChipView) {
            gsap.to(chip.bevelFilter, {
                thickness: 7,
                rotation: 240,
                duration: 0.3,
                shadowAlpha: 0.1,
                lightAlpha: 0.6,
                ease: 'expo.in',
            })
        },
        hide(chip: ChipView) {
            return new Promise((resolve) => gsap.to(chip, {
                id: 'hideChip',
                pixi: {
                    positionY: chip.y + 200,
                },
                delay: 0.2,
                duration: 0.5,
                ease: 'back.inOut',
                onComplete: resolve
            }))
        },
        show(chip: ChipView) {
            return new Promise((resolve) => gsap.to(chip, {
                id: 'showChip',
                pixi: {
                    positionY: chip.y - 200,
                },
                delay: 0.2,
                duration: 0.6,
                ease: 'back.inOut',
                onComplete: resolve
            }))
        },
    }

    public static cards = {
        pull(card: CardView) {
            return new Promise((resolve) => {
                gsap.to(card, {
                    id: 'pullCard',
                    pixi: {
                        positionX: card.position.x - 50,
                        positionY: card.position.y + 50,
                    },
                    duration: 0.3,
                    ease: 'circ.in',
                    onComplete: resolve,
                })
            })
        },
        deal(card: CardView, index: number, open: () => void) {
            return new Promise((resolve) => {
                gsap.to(card, {
                    id: 'dealCard',
                    pixi: {
                        positionX: index * 50,
                        positionY: 0,
                        angle: 0
                    },
                    duration: 1.5,
                    ease: "circ.out",
                    onStart: () => {
                        resolve(true)
                        open();
                    },
                })
            })
        },
        open(card: CardView) {
            return new Promise((resolve) => {
                const cardScale = card.backImage!.scale.y;
                console.log(cardScale)
                gsap.to(card.backImage, {
                    id: 'flipCard',
                    pixi: {
                        scaleX: 0,
                    },
                    duration: 0.2,
                    ease: 'power0.in',
                    onComplete: () => {
                        gsap.to(card.image!, {
                            pixi: {
                                scaleX: cardScale,
                            },
                            duration: 0.3,
                            ease: 'power0.out',
                            onStart: () => {
                                const cardScale = card.image!.scale.y;
                                gsap.to(card.image!, {
                                    pixi: {
                                        scaleY: cardScale + 0.1,
                                    },
                                    duration: 0.3,
                                    ease: 'sine.inOut',
                                    yoyo: true,
                                    repeat: 1,
                                    onComplete: resolve,
                                })
                            }
                        });
                        gsap.to({ x: card.dropShadowFilter.offset.x, y: card.dropShadowFilter.offset.y }, {
                            x: 20,
                            y: 10,
                            duration: 0.3,
                            ease: 'sine.inOut',
                            yoyo: true,
                            repeat: 1,
                            onUpdate: function () {
                                card.dropShadowFilter.offset.x = this.targets()[0].x;
                                card.dropShadowFilter.offset.y = this.targets()[0].y;
                            }
                        })
                    }
                })
            })
        },
        addPointsLabel(label: Sprite) {
            gsap.to(label, {
                id: 'addPointsLabel',
                pixi: {
                    scaleX: 1,
                },
                duration: 0.3,
                ease: 'back.out',
            })
        },
        updatePointsLabel(label: Sprite) {
            gsap.to(label.children[0], {
                id: 'addPointsLabel',
                pixi: {
                    scale: 1.3,
                },
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power4.inOut',
            })
        }
    }

    public static headerText = {
        update(num: Text, name: string, newValue: number, func: (name: string, value: string) => string) {
            gsap.to(num, {
                pixi: {
                    text: newValue,
                },
                duration: 0.5,
                onUpdate() {
                    const number = Number(num.text);
                    num.text = func(name, Math.round(number).toString());
                },
            })
        }
    }

    public static chipStack = {
        remove(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'removeChipStack',
                pixi: {
                    positionX: element.position.x - Main.screenSize.width / 2,
                },
                delay: 0.2,
                duration: 1,
                ease: 'back.inOut',
                onComplete: resolve,
            }))
        }
    }

    public static popup = {
        show(element: Container) {
            return new Promise(resolve => gsap.to(element, {
                id: 'showPopup',
                pixi: {
                    scale: 1.1,
                },
                delay: 0.1,
                yoyo: true,
                repeat: 1,
                duration: 1,
                ease: 'back.out',
                repeatDelay: 0.1,
                onComplete: resolve,
            }))
        }
    }
}