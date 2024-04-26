export class Box {
    constructor(position = new DOMPoint(), width = 0, height = 0) {
        this.position = position;
        this.width = width;
        this.height = height;
    }
}
export class Animations {
    constructor(animationName, props) {
        this.animationName = animationName;
        this.props = props;
        this.isActive = false;
    }
}
export class AnimationProp {
    constructor(frameCount, frameBuffer, loop, src, image) {
        this.frameCount = frameCount;
        this.frameBuffer = frameBuffer;
        this.loop = loop;
        this.src = src;
        this.image = image;
    }
}
