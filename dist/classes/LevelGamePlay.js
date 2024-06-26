import { Level } from "@/classes/Level";
import { Player } from "@/classes/Player";
import { Collectibles } from "@/classes/Collectibles";
import { OBJECT_ANIMATION_NAME, SOUND_FX } from "@/constants/game-conts";
import { audio } from "@/core/audio";
import { DashPoint } from "@/classes/DashPoint";
export class LevelGamePlay extends Level {
    constructor(level, playerObj) {
        super(level, playerObj);
        this.dashTime = 8;
        this.remainingDashTime = 0;
    }
    update() {
        this.playerAndCollectibles();
        this.playerAndDashPoint();
        this.playerAndEnemy();
        if (this.remainingDashTime > 0) {
            this.remainingDashTime--;
        }
        else {
            DashPoint.isDashPointCollided = false;
        }
    }
    playerAndCollectibles() {
        // console.log('hi from LGP' + this.player);
        const indexOfObject = this.collectibles.findIndex((data) => data.name === this.player.collidedWith);
        if (this.collectibles.length > 0 && this.player.isAlive) {
            if (Collectibles.isCollectiblesCollided) {
                if (this.player.collidedWith && indexOfObject > -1) {
                    if (SOUND_FX)
                        audio.playCupFx();
                    if (this.collectibles[indexOfObject].velocity) {
                        this.collectibles[indexOfObject].velocity.y = -0.4;
                    }
                    this.collectibles[indexOfObject].playAnimation(OBJECT_ANIMATION_NAME.CUP_EFFECT);
                    this.collectibles[indexOfObject].hitBox.position.x = 100000000;
                    this.player.collidedWith = '';
                    if (this.collectibles[indexOfObject].currentAnimation)
                        this.collectibles[indexOfObject].currentAnimation.isActive = false;
                    if (this.collectibles[indexOfObject].animations) {
                        this.collectibles[indexOfObject].animations?.forEach((data) => {
                            // const anim = new Animation(data.animationName, data.props);
                            if (data.animationName === OBJECT_ANIMATION_NAME.CUP_EFFECT) {
                                data.onComplete = () => {
                                    // console.log('conplete from index')
                                    this.collectibles.splice(indexOfObject, 1);
                                    Player.ItemCollectedCount++;
                                    Collectibles.isCollectiblesCollided = false;
                                };
                            }
                            ;
                        });
                    }
                }
            }
            else {
                if (this.collectibles && this.collectibles.length > 0) {
                    this.collectibles.forEach((cup) => {
                        cup.playAnimation(OBJECT_ANIMATION_NAME.CUP);
                    });
                }
            }
        }
    }
    playerAndDashPoint() {
        const indexOfObject = this.dashPoint.findIndex((data) => data.name === this.player.collidedWith);
        if (this.dashPoint.length > 0) {
            if (DashPoint.isDashPointCollided) {
                if (this.player.collidedWith && indexOfObject > -1) {
                    this.dashPoint[indexOfObject].playAnimation(OBJECT_ANIMATION_NAME.DASH_POINT_CRACKED);
                    this.player.collidedWith = '';
                    if (this.dashPoint[indexOfObject].currentAnimation)
                        this.dashPoint[indexOfObject].currentAnimation.isActive = false;
                    this.player.dashMove(true);
                    this.remainingDashTime = this.dashTime;
                    if (this.dashPoint[indexOfObject].animations) {
                        this.dashPoint[indexOfObject].animations?.forEach((data) => {
                            if (data.animationName === OBJECT_ANIMATION_NAME.DASH_POINT_CRACKED) {
                                data.onComplete = () => {
                                    // DashPoint.isDashPointCollided = false;
                                };
                            }
                            ;
                        });
                    }
                }
            }
            else {
                if (this.dashPoint && this.dashPoint.length > 0) {
                    this.dashPoint.forEach((dPoint) => {
                        dPoint.playAnimation(OBJECT_ANIMATION_NAME.DASH_POINT);
                    });
                }
            }
        }
    }
    playerAndEnemy() {
        if (this.enemies && this.enemies.length > 0) {
            this.enemies.forEach((enemy) => {
                if (enemy.canMove) {
                    if (enemy.isMoveHorzontal) {
                        enemy.enemyPatrolHorzontal(enemy.startPositionX, enemy.startPositionX + enemy.moveLength, enemy.waitAtEnd, enemy.moveSpeed);
                    }
                    else if (enemy.isMoveVertical) {
                        enemy.enemyPatrolVertical(enemy.startPositionY, enemy.startPositionY + enemy.moveLength, enemy.waitAtEnd, enemy.moveSpeed);
                    }
                }
                enemy.playAnimation(OBJECT_ANIMATION_NAME.ENEMY_IDLE);
            });
        }
    }
}
