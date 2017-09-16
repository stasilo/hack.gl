let handler = null;
let position = {
    x: 0,
    y: 0
};

export default function getMousePosition(canvas) {
    if(!handler) {
        handler = canvas.onmousemove = e => {
            position = {
                x: (e.pageX - canvas.offsetLeft) / canvas.width,
                y: (e.pageY - canvas.offsetTop) / canvas.height
            }
        }
    }

    return [position.x, position.y];
}
