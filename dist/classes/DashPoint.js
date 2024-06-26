import { GameObject } from "@/classes/GameObject";
import { DEBUGGER } from "@/constants/game-conts";
import { debugBox } from "@/core/utils";
export class DashPoint extends GameObject {
    constructor(position, src, player, animations, loop) {
        super(position, src, player, animations, loop);
        this.name = 'dash_point_';
        this.hitBox.position.x = this.position.x + 16;
        this.hitBox.position.y = this.position.y + 16;
        this.hitBox.width = 14;
        this.hitBox.height = 14;
        this.xHopVal = Math.random() * Math.PI * 2;
        this.yHopVal = this.xHopVal * 2;
    }
    update() {
        if (DEBUGGER) {
            // Hit Box
            debugBox(this.hitBox, 'green');
        }
        this.loop = true;
        if (!DashPoint.isDashPointCollided && this.player.isAlive) {
            DashPoint.isDashPointCollided = this.checkCollision();
        }
        else if (!this.player.isAlive) {
            DashPoint.isDashPointCollided = false;
        }
        if (!DashPoint.isDashPointCollided) {
            this.orbHop();
            // console.log('dash point call')
        }
        else {
        }
    }
    orbHop() {
        this.xHopVal += 0;
        this.yHopVal += .1;
        this.position.y = this.position.y + Math.sin(this.yHopVal) * .2;
    }
}
// protected height: number = 48;
// protected width: number = 48;
DashPoint.isDashPointCollided = false;
