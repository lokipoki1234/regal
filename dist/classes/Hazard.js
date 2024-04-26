import { GameObject } from "@/classes/GameObject";
import { DEBUGGER } from "@/constants/game-conts";
import { debugBox } from "@/core/utils";
export class Hazard extends GameObject {
    // protected collisionBlocks: Array<CollisionBlock> | undefined = [];
    // public hitBox: Box = new Box();
    constructor(position, src, player, animations, loop) {
        super(position, src, player, animations, loop);
        // public position: DOMPoint;
        this.height = 10;
        this.width = 16;
        this.name = 'hazard';
        this.hitBox.position.x = this.position.x + 3;
        this.hitBox.position.y = this.position.y + 11;
        this.hitBox.width = 9;
        this.hitBox.height = 5;
    }
    update() {
        if (DEBUGGER) {
            // Hit Box
            debugBox(this.hitBox, 'red');
            debugBox(this, 'blue');
        }
        if (!Hazard.isHazardCollided && this.player.isAlive) {
            Hazard.isHazardCollided = this.checkCollision();
        }
        else if (!this.player.isAlive) {
            Hazard.isHazardCollided = false;
        }
        if (Hazard.isHazardCollided) {
            // console.log('player can die here');
        }
        else {
            // console.log('player is safe');
        }
    }
}
Hazard.isHazardCollided = false;
