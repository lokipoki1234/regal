class Controls {
    constructor() {
        this.isUp = false;
        this.isDown = false;
        this.isLeft = false;
        this.isRight = false;
        this.isConfirm = false;
        this.isEscape = false;
        this.isJump = false;
        this.keyMap = new Map();
        this.previousState = { isUp: this.isUp, isDown: this.isDown, isConfirm: this.isConfirm,
            isEscape: this.isEscape, isJump: this.isJump, isLeft: this.isLeft, isRight: this.isRight };
        document.addEventListener('keydown', event => this.toggleKey(event, true));
        document.addEventListener('keyup', event => this.toggleKey(event, false));
        this.inputDirection = new DOMPoint();
    }
    queryController() {
        this.previousState.isUp = this.isUp;
        this.previousState.isDown = this.isDown;
        this.previousState.isConfirm = this.isConfirm;
        this.previousState.isEscape = this.isEscape;
        this.previousState.isJump = this.isJump;
        this.previousState.isLeft = this.isLeft;
        this.previousState.isRight = this.isRight;
        const gamepad = navigator.getGamepads()[1];
        const isButtonPressed = (button) => gamepad?.buttons[button].pressed;
        const leftVal = (this.keyMap.get('KeyA') || this.keyMap.get('ArrowLeft') || isButtonPressed(14 /* XboxControllerButton.DpadLeft */)) ? -1 : 0;
        const rightVal = (this.keyMap.get('KeyD') || this.keyMap.get('ArrowRight') || isButtonPressed(15 /* XboxControllerButton.DpadRight */)) ? 1 : 0;
        const upVal = (this.keyMap.get('KeyW') || this.keyMap.get('ArrowUp') || isButtonPressed(12 /* XboxControllerButton.DpadUp */)) ? -1 : 0;
        const downVal = (this.keyMap.get('KeyS') || this.keyMap.get('ArrowDown') || isButtonPressed(13 /* XboxControllerButton.DpadDown */)) ? 1 : 0;
        this.inputDirection.x = (leftVal + rightVal) || gamepad?.axes[0] || 0;
        this.inputDirection.y = (upVal + downVal) || gamepad?.axes[1] || 0;
        const deadzone = 0.1;
        if (Math.hypot(this.inputDirection.x, this.inputDirection.y) < deadzone) {
            this.inputDirection.x = 0;
            this.inputDirection.y = 0;
        }
        this.isUp = this.inputDirection.y < 0;
        this.isDown = this.inputDirection.y > 0;
        this.isLeft = this.inputDirection.x < 0;
        this.isRight = this.inputDirection.x > 0;
        this.isConfirm = Boolean(this.keyMap.get('Enter') || isButtonPressed(9 /* XboxControllerButton.Start */) || isButtonPressed(9 /* XboxControllerButton.Start */));
        this.isEscape = Boolean(this.keyMap.get('Escape') || isButtonPressed(8 /* XboxControllerButton.Select */));
        this.isJump = Boolean(this.keyMap.get('ArrowUp') || isButtonPressed(0 /* XboxControllerButton.A */));
    }
    toggleKey(event, isPressed) {
        this.keyMap.set(event.code, isPressed);
    }
}
export const controls = new Controls();
