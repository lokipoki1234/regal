import { Box } from "@/model/common.model";
import { Sprite } from "@/classes/Sprite";
import { collisions } from "@/core/utils";
export class GameObject extends Sprite {
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    constructor(position, src, player, animations, loop, frameCount, frameBuffer, velecity, gravity, speed, collisionBlocks) {
        super(position, src, animations, frameCount, frameBuffer, loop);
        this.collisionBlocks = [];
        this.hitBox = new Box();
        this._name = '';
        this.position = position;
        this.velocity = velecity;
        this.gravity = gravity;
        this.speed = speed;
        this.collisionBlocks = collisionBlocks;
        this.player = player;
        // this.hitBox = hitBox;
    }
    checkCollision() {
        if (collisions(this.player.hitBox, this.hitBox)) {
            // console.log('collided');
            this.player.collidedWith = this.name;
            return true;
        }
        else
            return false;
    }
    playAnimation(name, isFlip) {
        if (this.animations && this.animations.length > 0) {
            for (let i = 0; i < this.animations.length; i++) {
                if (this.animations[i].animationName === name) {
                    if (this.image === this.animations[i].props.image)
                        return;
                    if (this.animations[i].props.frameCount > 2)
                        this.currentframe = Math.floor(Math.random() * 2); //0;
                    else
                        this.currentframe = 0;
                    this.image = this.animations[i].props.image;
                    this.frameCount = this.animations[i].props.frameCount;
                    this.frameBuffer = this.animations[i].props.frameBuffer;
                    this.loop = this.animations[i].props.loop;
                    this.isFlip = isFlip;
                    this.currentAnimation = this.animations[i];
                }
            }
        }
    }
}
