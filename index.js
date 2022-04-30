const $root = document.getElementById("root");
const field_dom = new Array(21);
const field_state = new Array(21);
let timerid = null;
let mino = null;
let mino_y = null;
let mino_x = null;
let rot_state = 0;
let MINO_LIST = null;
let MINO_LIST_SIZE = null;
let MINO = null;
let is_game_over = false;
function main(MINO) {
    MINO = MINO;
    MINO_LIST = Object.keys(MINO);
    MINO_LIST_SIZE = MINO_LIST.length;
    initField();
    createWall();
    createGround();
    initMino();
    drawAll();
    connectKeyEvents();
    autoDown();
}

function connectKeyEvents() {
    addEventListener("keydown", (e) => {
        if (e.key == "ArrowLeft") {
            moveLeft();
        }
        if (e.key == "ArrowRight") {
            moveRight();
        }
        if (e.key === "ArrowDown") {
            moveDown();
        }
        if (e.key === "ArrowUp") {
            rotateMino();
        }
    });
}
function autoDown() {
    timerid = setInterval(moveDown, 1000);
}

function moveRight() {
    mino_x += 1;
    if (hitCheck()) {
        mino_x -= 1;
    }
    drawAll();
}
function moveLeft() {
    mino_x -= 1;
    if (hitCheck()) {
        mino_x += 1;
    }
    drawAll();
}
function moveDown() {
    mino_y += 1;
    if (hitCheck()) {
        mino_y -= 1;
        mergeMinoToField();
        deleteFilledLines();
        initMino();
    }
    drawAll();
}

function rotateMino() {
    rot_state = (rot_state + 1) % 4;
    if (hitCheck()) {
        rot_state = (rot_state + 3) % 4;
    }
    drawAll();
}

function initMino() {
    if (is_game_over) {
        return;
    }
    const rnd_i = Math.floor(Math.random() * MINO_LIST_SIZE);
    const mino_type = MINO_LIST[rnd_i];
    mino = MINO[mino_type];
    mino_x = 4;
    mino_y = 4;
    if (hitCheck()) {
        is_game_over = true;
        alert("GameOver");
        location.reload();
    }
}

function drawAll() {
    clearField();
    drawMino();
    drawField();
}
function clearField() {
    for (let yi = 0; yi < 21; yi++) {
        for (let xi = 0; xi < 12; xi++) {
            field_dom[yi][xi].classList.remove("block");
            field_dom[yi][xi].classList.remove("filled");
        }
    }
}

function hitCheck() {
    for (let yi = 0; yi < 4; yi++) {
        for (let xi = 0; xi < 4; xi++) {
            if (mino[rot_state][yi][xi] == 0) {
                continue;
            }
            const y = mino_y + yi;
            const x = mino_x + xi;
            if (field_state[y][x] === 1) {
                return true;
            }
        }
    }
    return false;
}

function drawMino() {
    for (let yi = 0; yi < 4; yi++) {
        for (let xi = 0; xi < 4; xi++) {
            if (mino[rot_state][yi][xi] == 0) {
                continue;
            }
            const y = mino_y + yi;
            const x = mino_x + xi;
            field_dom[y][x].classList.add("block");
        }
    }
}

function mergeMinoToField() {
    for (let yi = 0; yi < 4; yi++) {
        for (let xi = 0; xi < 4; xi++) {
            if (mino[rot_state][yi][xi] == 0) {
                continue;
            }
            const y = mino_y + yi;
            const x = mino_x + xi;
            field_state[y][x] = 1;
        }
    }
}

function deleteFilledLines() {
    for (let yi = 0; yi < 21; yi++) {
        // 一番下は床なので含めない
        if (yi == 20) {
            continue;
        }
        is_filled = true;
        for (let xi = 0; xi < 12; xi++) {
            if (field_state[yi][xi] == 0) {
                is_filled = false;
                break;
            }
        }
        if (is_filled) {
            for (let yj = yi; yj > 0; yj--) {
                for (let xj = 0; xj < 12; xj++) {
                    field_state[yj][xj] = field_state[yj - 1][xj];
                }
            }
        }
    }
}

function drawField() {
    for (let yi = 0; yi < 21; yi++) {
        for (let xi = 0; xi < 12; xi++) {
            if (field_state[yi][xi] == 1) {
                field_dom[yi][xi].classList.add("filled");
            }
        }
    }
}

function initField() {
    for (let yi = 0; yi < 21; yi++) {
        field_dom[yi] = new Array(12);
        field_state[yi] = new Array(12).fill(0);
        const $row = document.createElement("div");
        $row.classList.add("row");
        for (let xi = 0; xi < 12; xi++) {
            const $cell = document.createElement("div");
            $cell.classList.add("cell");
            $row.appendChild($cell);
            field_dom[yi][xi] = $cell;
        }
        $root.appendChild($row);
    }
}
function createWall() {
    for (let yi = 0; yi < 21; yi++) {
        field_state[yi][0] = 1;
        field_state[yi][11] = 1;
    }
}
function createGround() {
    for (let xi = 0; xi < 12; xi++) {
        field_state[20][xi] = 1;
    }
}
// MINOのデータを読み込んでからスタート
const req = new Request("./data.json");
fetch(req).then((res) =>
    res.json().then((data) => {
        main((MINO = data.MINO));
    })
);
