import { collisionsLevel1 } from './data/collisions';
import { Player } from "./classes/Player";
import { PLAYER_ANIMATION_NAME } from "./constants/game-conts";
import { controls } from "./core/controls";
import { createArrayFrom2D, fadeIn, fadeOut, parse2D } from './core/utils';
import { Animations } from './model/common.model';
import playerAnimationData from './data/playerAnimationData.json';
import allLevelData from '@/data/levelData.json';
import { LevelGamePlay } from './classes/LevelGamePlay';
// import { zzfx } from './core/zzFx';
import { camera } from './classes/Camara';
import { gameManager } from './classes/GameManager';
window.isPlayerDied = window.isPlayerDied || {};
window.onload = () => {
    let opacity = 0;
    let collisionBlocks = [];
    let parsedCollisions = parse2D(collisionsLevel1);
    collisionBlocks = createArrayFrom2D(parsedCollisions, 1);
    let playerPosition = new DOMPoint(100, 190);
    const playerImgSrc = 'img/king/king_idle.png';
    let playerAnimation = [];
    const canvas = document.getElementById('c2d');
    const fadeDuration = 500;
    playerAnimationData.forEach((data) => {
        const anim = new Animations(data.animationName, data.props);
        if (anim.animationName === PLAYER_ANIMATION_NAME.DOOR_ENTER) {
            anim.onComplete = () => {
                fadeOut(canvas, fadeDuration, () => {
                    levelCollection[levelCounter].isCollectibleLoaded = false;
                    levelCounter++;
                    levelCollection[levelCounter].init();
                    player.switchSprite(PLAYER_ANIMATION_NAME.IDLE, false);
                    player.preventInput = false;
                    fadeIn(canvas, fadeDuration, () => {
                    });
                });
            };
        }
        ;
        if (anim.animationName === PLAYER_ANIMATION_NAME.DIE) {
            anim.onComplete = () => {
                player.velocity.x = 0;
                player.velocity.y = 0;
                player.preventInput = false;
                fadeIn(canvas, fadeDuration, () => {
                });
                levelCollection[levelCounter].isCollectibleLoaded = true;
                levelCollection[levelCounter].init();
                player.switchSprite(PLAYER_ANIMATION_NAME.IDLE, false);
                player.isAlive = true;
                console.log('Toltal collectied cups: ' + Player.ItemCollectedCount);
                console.log('Total Deaths: ' + Player.TotalDeathCounter);
            };
        }
        playerAnimation.push(anim);
    });
    const player = new Player(collisionBlocks, playerPosition, playerImgSrc, playerAnimation, 3, 5);
    let previousTime = 0;
    const interval = 1000 / 60;
    // let levelCounter = 9;
    let levelCounter = 0;
    let levelCollection = [];
    let levelData = allLevelData;
    levelData.forEach((data) => {
        const level = new LevelGamePlay(data, player);
        level.levelCollisionBlocks = collisionsLevel1;
        levelCollection.push(level);
        // level.playerAndCollectibles();
        // level.playerAndDashPoint();
    });
    (function gameLoop(currentTime) {
        const delta = currentTime - previousTime;
        if (delta >= interval) {
            previousTime = currentTime - (delta % interval);
            controls.queryController();
            camera.update();
            camera.render();
            levelCollection[levelCounter].loadGameLevel();
            levelCollection[levelCounter].update();
            if (levelCounter == 6) {
                player.velocity.y -= 1;
                gameManager.gameFinished();
            }
            else {
                gameManager.startGameMenu(player);
            }
            window.deltaTime = delta;
            // backGroundLevel1.draw();
            // door.draw();
            // door.update();
            // collisionBlocks.forEach((block: CollisionBlock) => {
            //   block.draw();
            // })
            // player.draw();
            // player.update();
            // overlay();
        }
        requestAnimationFrame(gameLoop);
    })(0);
    levelCollection[levelCounter].init();
};
