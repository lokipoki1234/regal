import { GameObject } from "@/classes/GameObject";
import { DEBUGGER } from "@/constants/game-conts";
import { debugBox, lerp } from "@/core/utils";
export class Enemy extends GameObject {
    constructor(position, src, player, animations, loop) {
        super(position, src, player, animations, loop);
        this.patrolDirection = 1;
        this.startDelay = Math.random() * 100;
        this.name = 'enemy_';
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
            debugBox(this.hitBox, 'red');
        }
        // this.enemyPatrolVertical(100, 200);
        this.loop = true;
        if (Enemy.isEnemyCollided) {
            this.player.velocity.x = 0;
            this.player.velocity.y = 0;
        }
        if (!Enemy.isEnemyCollided && this.player.isAlive) {
            Enemy.isEnemyCollided = this.checkCollision();
        }
        else if (!this.player.isAlive) {
            Enemy.isEnemyCollided = false;
        }
        if (!Enemy.isEnemyCollided) {
            this.enemyHop();
        }
        else {
        }
    }
    enemyHop() {
        this.xHopVal += .8;
        this.yHopVal += .2;
        this.position.x = this.position.x + Math.cos(this.xHopVal) * .2;
        this.position.y = this.position.y + Math.sin(this.yHopVal) * .2;
    }
    enemyPatrolHorzontal(startPosX, endPosX, waitAtEnd = 0.1, enemySpeed = 0.1) {
        if (this.startDelay > 0) {
            this.startDelay -= Math.random() * 10; // Decrease the delay by the time between game loop iterations
            return; // Wait until the start delay has elapsed
        }
        const targetX = this.patrolDirection === 1 ? startPosX : endPosX;
        this.position.x = lerp(this.position.x, targetX, enemySpeed);
        this.hitBox.position.x = lerp(this.hitBox.position.x, targetX + 16, enemySpeed);
        const distanceSquared = (this.position.x - targetX) ** 2;
        const toleranceSquared = waitAtEnd;
        if (distanceSquared < toleranceSquared) {
            // Change patrol direction when the enemy reaches a point
            this.patrolDirection *= -1;
        }
    }
    enemyPatrolVertical(startPosY, endPosY, waitAtEnd = 0.1, enemySpeed = 0.1) {
        if (this.startDelay > 0) {
            this.startDelay -= Math.random() * 10; // Decrease the delay by the time between game loop iterations
            return; // Wait until the start delay has elapsed
        }
        const targetY = this.patrolDirection === 1 ? startPosY : endPosY;
        this.position.y = lerp(this.position.y, targetY, enemySpeed);
        this.hitBox.position.y = lerp(this.hitBox.position.y, targetY + 16, enemySpeed);
        const distanceSquared = (this.position.y - targetY) ** 2;
        const toleranceSquared = waitAtEnd;
        if (distanceSquared < toleranceSquared) {
            // Change patrol direction when the enemy reaches a point
            this.patrolDirection *= -1;
        }
    }
}
Enemy.isEnemyCollided = false;
