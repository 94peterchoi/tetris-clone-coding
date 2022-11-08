import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector('.playground > ul');
const gameText = document.querySelector('.game-text');
const scoreDisplay = document.querySelector('.score');
const restartButton = document.querySelector('.game-text > button');

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 30000;
let downInterval;
let tempMovingItem;
let currentItem = [];


const movingItem = {
    type: "",
    direction: 0,
    top: 0,
    left: 0,
};

init();


// functions
function init() {
    tempMovingItem = {...movingItem};

    for (let i=0; i<GAME_ROWS; i++) {
        prependNewLine();
    }  

    generateNewBlock();
}


function prependNewLine() {
    const li = document.createElement('li');
    const ul = document.createElement('ul');

    for (let j=0; j<GAME_COLS; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);

}

function renderBlocks(moveType="") {
    console.log('템무아 => ', tempMovingItem);
    const {type, direction, top, left} = tempMovingItem;
    BLOCKS[type][direction].some((block) => {
        const x = block[0] + left;
        const y = block[1] + top;
        // console.log({playground});
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        target.classList.add(type, 'moving');

        currentItem = [];
        currentItem.push(target);
        console.log('커런트아이템 => ', currentItem);
    });

    // const blocksToRemove = document.querySelectorAll('.moving');
    // blocksToRemove.forEach((block) => {
    //     block.classList.remove(type, 'moving');
    // });

    // movingItem.left = left;
    // movingItem.top = top;
    // movingItem.direction = direction;
}

function seizeBlock() {
    const blockToSeize = document.querySelectorAll('.moving');
    blockToSeize.forEach((block) => {
        block.classList.remove("moving");
        block.classList.add('seized');
    })
    console.log('시즈블럭 완료');
    checkMatch();
}

function checkMatch() {

    const childNodes = playground.childNodes;
    childNodes.forEach((child) => {
        let matched = true;
        child.children[0].childNodes.forEach((li) => {
            if (!li.classList.contains('seized')) {
                matched = false;
            }
        });
        if (matched) {
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerHTML = score;
        }
    })
    generateNewBlock();
}

function generateNewBlock() {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1);
    }, duration);

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    // console.log(blockArray[randomIndex][0]);
    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks();
}

function checkEmpty(target) {
    if (!target || target.classList.contains('seized')) {
        return false;
    }
    return true;
}


function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, 10);
}

function showGameOverText() {
    gameText.style.display = 'flex';
}

// event handling
document.addEventListener('keydown', (e) => {
    switch(e.keyCode) {
        case 39:    // 오른쪽 화살표
            moveBlock("left", 1);
            break;
        case 37:    // 왼쪽 화살표
            moveBlock("left", -1);
            break;
        case 40:    // 아래 화살표 
            moveBlock("top", 1);
            break;
        case 38:    // 위 화살표
            changeDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
});

restartButton.addEventListener('click', () => {
    playground.innerHTML = "";
    gameText.style.display = 'none'
    init();
})