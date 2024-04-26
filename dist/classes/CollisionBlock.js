import { DEBUGGER } from '@/constants/game-conts';
import { drawEngine } from '@/core/draw-engine';
export class CollisionBlock {
    constructor(position) {
        this.width = 16;
        this.height = 16;
        this.position = new DOMPoint();
        this.position = position;
    }
    draw() {
        if (DEBUGGER) {
            drawEngine.context.fillStyle = 'rgba(255, 0, 0, 0.4)';
            drawEngine.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}
