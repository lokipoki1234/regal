import { drawEngine } from "@/core/draw-engine";
export class Camera {
    constructor() {
        this.shaking = false;
        this.shakeStrength = 5;
        this.shakeDuration = 20; // in milliseconds
        this.shakeStartTime = 0;
    }
    update() {
        if (this.shaking) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this.shakeStartTime;
            const min = .2;
            const max = .3;
            if (elapsedTime < this.shakeDuration) {
                const offsetX = (Math.floor(min + Math.random() * (max - min + 1))) * this.shakeStrength - this.shakeStrength / 2;
                const offsetY = (Math.floor(min + Math.random() * (max - min + 1))) * this.shakeStrength - this.shakeStrength / 2;
                drawEngine.context.translate(offsetX, offsetY);
            }
            else {
                // Shake duration has elapsed, stop shaking
                this.shaking = false;
                drawEngine.context.setTransform(1, 0, 0, 1, 0, 0); // Reset the context translation
            }
        }
    }
    startShake(shakeDuration) {
        if (!this.shaking) {
            this.shakeDuration = shakeDuration ? shakeDuration : this.shakeDuration;
            this.shaking = true;
            this.shakeStartTime = Date.now();
        }
    }
    hitShake() {
        if (!this.shaking) {
            this.shakeDuration = 15;
            this.shakeStrength = 2;
            this.shaking = true;
            this.shakeStartTime = Date.now();
        }
    }
    dieShake() {
        if (!this.shaking) {
            this.shakeDuration = 40;
            this.shakeStrength = 5;
            this.shaking = true;
            this.shakeStartTime = Date.now();
        }
    }
    render() {
        drawEngine.context.clearRect(0, 0, drawEngine.canvasWidth, drawEngine.canvasHeight);
        // levelObj.loadGameLevel();
        // levelObj.update();
    }
}
export const camera = new Camera();
