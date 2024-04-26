import { Player } from "@/classes/Player";
import { PLAYER_ANIMATION_NAME } from "@/constants/game-conts";
import { controls } from "@/core/controls";
import { drawEngine } from "@/core/draw-engine";
class GameManager {
    constructor() {
        this.isStartSelected = true;
        this.isGameStarts = false;
        this.isPause = false;
    }
    startGameMenu(player) {
        if (!this.isGameStarts) {
            player.inputOff = true;
            player.switchSprite(PLAYER_ANIMATION_NAME.IDLE);
            player.velocity.x = 0;
            // player.velocity.y = 0;
            if (this.isPause) {
                this.gamePause();
            }
            else {
                this.titleScreen();
            }
            this.updateControls();
        }
        else if (this.isGameStarts) {
            if (controls.isConfirm && !controls.previousState.isConfirm) {
                this.isGameStarts = false;
                this.isPause = true;
                // return false;
            }
            else {
                //TODO: GAME PLAY GOSE HERE.
                this.isPause = false;
                player.inputOff = false;
            }
        }
    }
    updateControls() {
        if ((controls.isUp && !controls.previousState.isUp)
            || (controls.isDown && !controls.previousState.isDown)) {
            this.isStartSelected = !this.isStartSelected;
        }
        if (controls.isConfirm && !controls.previousState.isConfirm) {
            if (this.isStartSelected) {
                this.isGameStarts = true;
            }
            else {
                this.toggleFullscreen();
            }
        }
    }
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
    }
    titleScreen() {
        const xCenter = drawEngine.context.canvas.width / 2;
        drawEngine.drawText(`Regal Journey`, 25, xCenter, 100, '#ffcc00');
        drawEngine.drawText('Start Game', 22, xCenter, 135, this.isStartSelected ? 'white' : 'gray');
        drawEngine.drawText('Toggle Fullscreen', 22, xCenter, 167, this.isStartSelected ? 'gray' : 'white');
    }
    gamePause() {
        const xCenter = drawEngine.context.canvas.width / 2;
        drawEngine.drawText('Resume', 20, xCenter, 130, this.isStartSelected ? 'white' : 'gray');
        drawEngine.drawText('Toggle Fullscreen', 20, xCenter, 160, this.isStartSelected ? 'gray' : 'white');
        if (Player.ItemCollectedCount && Player.ItemCollectedCount > 0)
            drawEngine.drawText('Cups: ' + Player.ItemCollectedCount, 18, xCenter, 190, 'yellow');
        if (Player.TotalDeathCounter && Player.TotalDeathCounter > 0)
            drawEngine.drawText('Deaths: ' + Player.TotalDeathCounter, 18, xCenter, 210, 'yellow');
    }
    gameOver() {
    }
    gameFinished() {
        const xCenter = drawEngine.context.canvas.width / 2;
        drawEngine.drawText('Thanks you for Playing', 25, xCenter, 130, '#ffcc00');
        drawEngine.drawText('Created By: Himanshu Bisht', 25, xCenter, 160, 'white');
    }
}
export const gameManager = new GameManager();
