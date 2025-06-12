export default class CssAnimationController {
    constructor({options}) {
        this.isAnimating = false;
        this.animationDuration = 1000;
        this.onAnimationStart = options.onAnimationStart;
        this.onAnimationEnd = options.onAnimationEnd;
        this.onAnimationMiddle = options.onAnimationMiddle;
    }

    startAnimation() {
        this.isAnimating = true;
        this.onAnimationStart && this.onAnimationStart();
    }

    endAnimation() {
        this.isAnimating = false;
        this.onAnimationEnd && this.onAnimationEnd();
    }
}