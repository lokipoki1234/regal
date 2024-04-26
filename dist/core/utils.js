import { CollisionBlock } from "@/classes/CollisionBlock";
import { drawEngine } from "./draw-engine";
export function parse2D(array) {
    const rows = [];
    for (let i = 0; i < array.length; i += 32) {
        rows.push(array.slice(i, i + 32));
    }
    return rows;
}
export function createArrayFrom2D(array, symbolKey) {
    const objects = [];
    array.forEach((row, yIndex) => {
        row.forEach((symbol, xIndex) => {
            if (symbol == symbolKey) {
                let position = new DOMPoint(0, 0);
                // Push new collision into new collision block array.
                position.x = xIndex * 16;
                position.y = (yIndex * 16);
                objects.push(new CollisionBlock(position));
            }
        });
    });
    return objects;
}
export function collisions(objectA, objectB) {
    return (objectA.position.x <= objectB.position.x + objectB.width &&
        objectA.position.x + objectA.width >= objectB.position.x &&
        objectA.position.y + objectA.height >= objectB.position.y &&
        objectA.position.y <= objectB.position.y + objectB.height);
}
export function debugBox(gameObject, color) {
    drawEngine.context.strokeStyle = color;
    drawEngine.context.lineWidth = 1;
    drawEngine.context.beginPath();
    drawEngine.context.rect(gameObject.position.x, gameObject.position.y, gameObject.width, gameObject.height);
    drawEngine.context.stroke();
}
export function fadeIn(element, duration, onComplete) {
    let startTime = null;
    function animate(timestamp) {
        if (!startTime)
            startTime = timestamp;
        const elapsed = timestamp - startTime;
        const opacity = Math.min(1, elapsed / duration);
        element.style.opacity = opacity.toString();
        if (opacity < 1) {
            requestAnimationFrame(animate);
        }
        else {
            if (onComplete) {
                onComplete();
            }
        }
    }
    requestAnimationFrame(animate);
}
export function fadeOut(element, duration, onComplete) {
    let startTime = null;
    function animate(timestamp) {
        if (!startTime)
            startTime = timestamp;
        const elapsed = timestamp - startTime;
        const opacity = 1 - Math.min(1, elapsed / duration);
        element.style.opacity = opacity.toString();
        if (opacity > 0) {
            requestAnimationFrame(animate);
        }
        else {
            if (onComplete) {
                onComplete();
            }
        }
    }
    requestAnimationFrame(animate);
}
export function degreeToRadian(degree) {
    return Math.PI / 180 * degree;
}
export function lerp(start, end, speed) {
    return start + (end - start) * speed;
}
