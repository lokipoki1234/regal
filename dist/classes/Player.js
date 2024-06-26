import { drawEngine } from "@/core/draw-engine";
import { Sprite } from "@/classes/Sprite";
import { controls } from '@/core/controls';
import { collisions } from '@/core/utils';
import { Box } from "@/model/common.model";
import { CANVAS_HEIGHT, DEBUGGER, PLAYER_ANIMATION_NAME, SOUND_FX } from "@/constants/game-conts";
import { Door } from "@/classes/Door";
import { Hazard } from "@/classes/Hazard";
// import { zzfx } from "@/core/zzFx.min";
import { camera } from "@/classes/Camara";
import { audio } from "@/core/audio";
import { Enemy } from "@/classes/Enemy";
export class Player extends Sprite {
    constructor(collisionBlocks, position, src, animations, frameCount, frameBuffer, loop = true) {
        super(position, src, animations, frameCount, frameBuffer, loop);
        this.name = 'player';
        // position: DOMPoint = new DOMPoint(100, 100);
        this.health = 10;
        this.collisionBlocks = [];
        this.isOnGround = false;
        this.hitBox = new Box();
        this.preventInput = false;
        this.isAlive = true;
        this.isDash = false;
        this.dashTime = 8;
        this.remainingDashTime = 0;
        this.dieCallCounter = 0;
        this.onGroundCounter = 0;
        this.playerDirection = 0;
        this.inputOff = true;
        this.opacity = 0;
        this.position = position;
        this.velocity = new DOMPoint();
        this.width = 16;
        this.height = 16;
        this.gravity = 0.6;
        this.speed = 2.2;
        this.jumpStrength = -7.35;
        this.maxFallSpeed = 0.92;
        this.collisionBlocks = collisionBlocks;
        this.dashSpeed = 54;
        this.isTouchLeftWall = false;
        this.isTouchRightWall = false;
        this.isWallJump = false;
        this.wallJumpCooldown = false;
        this.wallJumpXvelocity = 2;
        this.wallJumpYvelocity = -7;
        this.accelerationX = 0.18;
        this.friction = .6;
        this.coyoteFrames = 6;
        this.remainingCoyoteFrames = 0;
    }
    update() {
        // this.position.x += this.velocity.x;
        this.updateHitBox();
        this.checkForHorizontalCollision();
        if (!this.isDash)
            this.applyGravity();
        if (this.remainingDashTime > 0) {
            // this.isDash = true;
            this.remainingDashTime--;
        }
        else {
            this.isDash = false;
        }
        this.updateHitBox();
        if (DEBUGGER) {
            drawEngine.context.strokeStyle = 'Green';
            drawEngine.context.lineWidth = 1;
            drawEngine.context.beginPath();
            drawEngine.context.rect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);
            drawEngine.context.stroke();
        }
        this.checkForVerticalCollision();
        if (this.velocity.y === 0) {
            this.isOnGround = true;
        }
        else {
            this.isOnGround = false;
        }
        this.controls();
        this.position.x += this.velocity.x;
        this.checkCollisionWithGameObjects();
        if (Door.isDoorCollided) {
            // console.log('door collied msg from player class');
        }
        //For wall jump.
        if (!this.isTouchLeftWall && !this.isTouchRightWall) {
            this.isWallJump = false;
        }
        else if ((this.isTouchLeftWall || this.isTouchRightWall) && this.isDash) {
            this.isDash = false;
        }
        //Coyote jump.
        if (this.isOnGround) {
            this.remainingCoyoteFrames = this.coyoteFrames;
        }
        else if (this.remainingCoyoteFrames > 0) {
            this.remainingCoyoteFrames--;
        }
        this.dieByFalling();
        this.roofHitScreenShake();
        // console.log('wall-------'+this.isTouchLeftWall);
    }
    switchSprite(name, isFlip) {
        if (this.animations) {
            for (let i = 0; i < this.animations.length; i++) {
                if (this.animations[i].animationName === name) {
                    if (this.image === this.animations[i].props.image)
                        return;
                    this.currentframe = 0;
                    this.image = this.animations[i].props.image;
                    this.frameCount = this.animations[i].props.frameCount;
                    this.frameBuffer = this.animations[i].props.frameBuffer;
                    this.loop = this.animations[i].props.loop;
                    this.isFlip = isFlip;
                    this.currentAnimation = this.animations[i];
                    if (name === PLAYER_ANIMATION_NAME.DASH) {
                        this.animations[i].onComplete = () => {
                            this.isDash = false;
                            this.velocity.x = 0;
                            this.velocity.y = 0;
                            console.log('dash ends');
                        };
                    }
                }
            }
        }
    }
    updateHitBox() {
        this.hitBox.position.x = this.position.x + 20;
        this.hitBox.position.y = this.position.y + 19.5;
        this.hitBox.width = 8;
        this.hitBox.height = 12;
    }
    applyGravity() {
        this.velocity.y += this.gravity;
        if (this.velocity.y > this.maxFallSpeed) {
            this.velocity.y *= this.maxFallSpeed;
        }
        this.position.y += this.velocity.y;
    }
    checkForVerticalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            let collisionBlock = this.collisionBlocks[i];
            if (collisions(this.hitBox, collisionBlock)) {
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    const offSet = this.hitBox.position.y - this.position.y;
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offSet + 0.01;
                    this.isTouchLeftWall = false;
                    this.isTouchRightWall = false;
                    break;
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    const offSet = this.hitBox.position.y - this.position.y + this.hitBox.height;
                    this.position.y = collisionBlock.position.y - offSet - 0.01;
                    this.isTouchLeftWall = false;
                    this.isTouchRightWall = false;
                    break;
                }
            }
        }
    }
    checkForHorizontalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            let collisionBlock = this.collisionBlocks[i];
            if (collisions(this.hitBox, collisionBlock)) {
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                    const offSet = this.hitBox.position.x - this.position.x;
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offSet + 0.01;
                    this.isTouchLeftWall = true;
                    this.isTouchRightWall = false;
                    break;
                }
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                    const offSet = this.hitBox.position.x - this.position.x + this.hitBox.width;
                    this.position.x = collisionBlock.position.x - offSet - 0.01;
                    this.isTouchLeftWall = false;
                    this.isTouchRightWall = true;
                    break;
                }
            }
        }
    }
    roofHitScreenShake() {
        if (this.isOnGround && controls.previousState.isJump) {
            this.onGroundCounter++;
            if (this.onGroundCounter == 1) {
                camera.hitShake();
            }
        }
    }
    checkPlayerDownFall() {
        if (this.velocity.y > 0 && !this.isOnGround) {
            this.fallStartPosition = this.position.y;
        }
    }
    checkPlayerLanded() {
        if (this.isOnGround) {
            this.onGroundCounter++;
            this.fallEndPoistion = this.position.y;
            if (this.fallEndPoistion - this.fallStartPosition > 1 && this.onGroundCounter == 1) {
                camera.hitShake();
            }
        }
    }
    dieByFalling() {
        if (this.position.y > CANVAS_HEIGHT) {
            this.dieCallCounter++;
            if (this.dieCallCounter == 1) {
                this.playerDie();
            }
        }
    }
    playerDie() {
        this.isDash = false;
        this.isAlive = false;
        this.preventInput = true;
        this.velocity.x = -.7;
        this.velocity.y = -4;
        this.switchSprite(PLAYER_ANIMATION_NAME.DIE, false);
        camera.dieShake();
        audio.playDieFx();
        console.log('Dead!!!!');
        Player.TotalDeathCounter++;
    }
    checkCollisionWithGameObjects() {
        //TODO: Check collisions with enemies and bullets
        if (Hazard.isHazardCollided && this.isAlive) {
            Hazard.isHazardCollided = false;
            this.playerDie();
        }
        if (Enemy.isEnemyCollided && this.isAlive) {
            Enemy.isEnemyCollided = false;
            this.playerDie();
        }
    }
    jump() {
        if (controls.inputDirection.x === -1 && !this.isOnGround) {
            this.switchSprite(PLAYER_ANIMATION_NAME.JUMP, true);
        }
        else if (controls.inputDirection.x === 1 && !this.isOnGround) {
            this.switchSprite(PLAYER_ANIMATION_NAME.JUMP);
        }
        else {
        }
        if (this.velocity.y === 0 && !controls.previousState.isJump) {
            this.velocity.y = this.jumpStrength;
            this.onGroundCounter = 0;
            // this.switchSprite('jump_effect', false);
            if (SOUND_FX)
                audio.playJumpFx(); // zzfx(...[,,372,.03,.04,,1,1.34,-9.5,.2,,,,,,,,.64,.05,.01]);// zzfx(...[, 0, 402, , .02, .09, 1, .41, 3.9, -0.2, -50, .01, , , , , , .75, .04]);// playJumpSound();
        }
    }
    coyoteJump() {
        if (!this.isOnGround && this.remainingCoyoteFrames > 0) {
            if (controls.inputDirection.x === -1) {
                this.switchSprite(PLAYER_ANIMATION_NAME.JUMP, true);
            }
            else if (controls.inputDirection.x === 1) {
                this.switchSprite(PLAYER_ANIMATION_NAME.JUMP, false);
            }
            else {
            }
            if (this.velocity.y > 0 && !controls.previousState.isJump) {
                this.velocity.y = this.jumpStrength;
                this.onGroundCounter = 0;
                if (SOUND_FX)
                    audio.playJumpFx(); // zzfx(...[,,372,.03,.04,,1,1.34,-9.5,.2,,,,,,,,.64,.05,.01]);// zzfx(...[, 0, 402, , .02, .09, 1, .41, 3.9, -0.2, -50, .01, , , , , , .75, .04]);// playJumpSound();
            }
            this.remainingCoyoteFrames = 0;
        }
    }
    dashMove(isDash) {
        // TODO: for dash move when collied with special object.
        if (!this.isAlive)
            return;
        this.remainingDashTime = this.dashTime;
        this.isDash = isDash;
        if (this.playerDirection === 1) {
            this.switchSprite(PLAYER_ANIMATION_NAME.DASH, false);
            this.velocity.x = this.dashSpeed;
            this.position.x += this.velocity.x;
        }
        else if (this.playerDirection === -1) {
            this.switchSprite(PLAYER_ANIMATION_NAME.DASH, true);
            this.velocity.x = this.dashSpeed;
            this.position.x -= this.velocity.x;
        }
        if (this.currentAnimation) {
            this.currentAnimation.isActive = false;
        }
        audio.playDashFx();
        camera.hitShake();
        // zzfx(...[2.06, 0, 69.41, , .07, .16, , 1.38, .1, .1, 50, .02, -0.01, .2, , , .08, .26, .06]); // dash sound.
    }
    wallJump() {
        if (this.isTouchRightWall && !this.isWallJump && !this.wallJumpCooldown && !controls.previousState.isLeft) {
            this.isWallJump = true;
            this.velocity.x = -this.wallJumpXvelocity;
            this.velocity.y = this.wallJumpYvelocity;
            this.switchSprite(PLAYER_ANIMATION_NAME.IDLE, true);
            this.wallJumpCooldown = true;
            setTimeout(() => {
                this.wallJumpCooldown = false;
            }, 100);
        }
        else if (this.isTouchLeftWall && !this.isWallJump && !this.wallJumpCooldown && !controls.previousState.isRight) {
            this.isWallJump = true;
            this.velocity.x = this.wallJumpXvelocity;
            this.velocity.y = this.wallJumpYvelocity;
            this.switchSprite(PLAYER_ANIMATION_NAME.IDLE, false);
            this.wallJumpCooldown = true;
            setTimeout(() => {
                this.wallJumpCooldown = false;
            }, 100);
        }
        if (SOUND_FX)
            audio.playJumpFx(); // zzfx(...[,,372,.03,.04,,1,1.34,-9.5,.2,,,,,,,,.64,.05,.01]); // zzfx(...[, 0, 402, , .02, .09, 1, .41, 3.9, -0.2, -50, .01, , , , , , .75, .04]);// playJumpSound();
    }
    controls() {
        if (this.inputOff)
            return;
        if (this.preventInput)
            return;
        if (!this.isWallJump) {
            if (controls.isLeft && !controls.previousState.isRight) {
                this.playerDirection = -1;
                if (this.isOnGround) {
                    this.switchSprite(PLAYER_ANIMATION_NAME.RUN, true);
                    this.velocity.x -= this.accelerationX;
                }
                else {
                    this.velocity.x = -this.speed;
                }
            }
            else if (controls.isRight && !controls.previousState.isLeft) {
                this.playerDirection = 1;
                if (this.isOnGround) {
                    this.switchSprite(PLAYER_ANIMATION_NAME.RUN, false);
                    this.velocity.x += this.accelerationX;
                }
                else {
                    this.velocity.x = +this.speed;
                }
            }
            else if (this.isOnGround) {
                if (controls.previousState.isLeft) {
                    this.switchSprite(PLAYER_ANIMATION_NAME.IDLE, true);
                }
                else
                    this.switchSprite(PLAYER_ANIMATION_NAME.IDLE, false);
                this.velocity.x *= this.friction; // 0.8;
            }
            else if (!this.isOnGround && controls.previousState.isLeft && !this.isDash) {
                this.switchSprite(PLAYER_ANIMATION_NAME.IDLE, true);
            }
            else if (!this.isOnGround && controls.previousState.isRight && !this.isDash) {
                this.switchSprite(PLAYER_ANIMATION_NAME.IDLE, false);
            }
        }
        this.velocity.x = Math.max(-this.speed, Math.min(this.speed, this.velocity.x));
        if (Door.isDoorCollided) {
            if ((controls.isUp && !controls.previousState.isRight && !controls.previousState.isLeft) || (controls.isJump && !controls.previousState.isJump)) {
                // console.log('Enter to door');
                this.preventInput = true;
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.switchSprite(PLAYER_ANIMATION_NAME.DOOR_ENTER, false);
                audio.playDoorFx();
                return;
            }
        }
        // Normal Jump.
        if (controls.isJump && !controls.previousState.isJump) {
            if (this.isOnGround) {
                this.jump();
            }
            else {
                this.coyoteJump();
            }
        }
        // Wall Jump.
        if (controls.isJump && !this.isOnGround && !controls.previousState.isJump) {
            this.wallJump();
        }
    }
}
Player.ItemCollectedCount = 0;
Player.TotalDeathCounter = 0;
