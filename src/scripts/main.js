const BOMB_SYMBOL = '*';
const MAX_BOMBS = 170;
const MIN_BOMBS = 0;
const MAX_SIZE = 50;
const MIN_SIZE = 0;


let size = 10;
let bombs = 15;
let baseMatriz = [];

let countCorrectBlockedFields = 0;

let SizeElement = null;
let BombsElement = null;
let ReloadComponent = null;
let OutputElement = null;


window.onload = () => {
    SizeElement = document.getElementById('size');
    BombsElement = document.getElementById('bombs');
    ReloadComponent = document.getElementById('reload');
    OutputElement = document.getElementById('output');

    SizeElement.value = size;
    BombsElement.value = bombs;

    // ação do botão de reload do campo minado
    ReloadComponent.addEventListener('click', function() {
        if(!updateSize()) {
            return;
        }
        
        if(!updateBombs()) {
            return;
        }

        countCorrectBlockedFields = 0;

        reloadComponent();
    })
}

function updateSize() {
    let internalSize = parseInt(SizeElement.value)

    if(internalSize === NaN) {
        alert('O tamanho precisa ser um número');
        SizeElement.value = size;
        return false;
    }

    if(internalSize <= MIN_SIZE) {
        alert(`O tamanho precisa ser um número maior que ${MIN_SIZE}`);
        SizeElement.value = size;
        return false;
    }

    if(internalSize > MAX_SIZE) {
        alert(`O tamanho precisa ser um número menor que ${MAX_SIZE}`);
        SizeElement.value = size;
        return false;
    }

    size = internalSize;
    return true;
}

function updateBombs() {
    let internalBombs = parseInt(BombsElement.value)

    if(internalBombs >= (size * size)) {
        alert('O número de bombas excede o tamanho do campo, reduza a quantidade ou aumente o campo');
        return false;
    }

    if(internalBombs === NaN) {
        alert('O tamanho precisa ser um número');
        BombsElement.value = bombs;
        return false;
    }

    if(internalBombs <= MIN_BOMBS) {
        alert(`O tamanho precisa ser um número maior que ${MIN_BOMBS}`);
        BombsElement.value = bombs;
        return false;
    }

    if(internalBombs > MAX_BOMBS) {
        alert(`O tamanho precisa ser um número menor que ${MAX_BOMBS}`);
        BombsElement.value = bombs;
        return false;
    }

    bombs = internalBombs;
    return true;
}


function reloadComponent() {
    resetBaseMatriz();
    clearOutput();
    
    createMatriz();
    applyGridInOutputElement();
    
    createBombs();
    addNumbers();
}

function resetBaseMatriz() {
    baseMatriz = [];
}

function createMatriz() {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            
            if(!baseMatriz[x]) {
                baseMatriz[x] = [];
            }
            
            baseMatriz[x][y] = {
                element: getFieldElement(x,y),
                value: 0
            };
        }
    }
}

function createBombs() {
    let i = 0;

    while (i < bombs) {
        const [x,y] = getRandonPosition();


        if(baseMatriz[x][y].value === BOMB_SYMBOL) {
            continue;
        }

        baseMatriz[x][y].value = BOMB_SYMBOL

        i++;
    }
}

function getRandonPosition() {
    return [
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size)
    ];
}

function addNumbers() {
    for (let x = 0; x < baseMatriz.length; x++) {
        for (let y = 0; y < baseMatriz[x].length; y++) {
            if(baseMatriz[x][y].value === BOMB_SYMBOL) {
                incrementNearbyNumbers(x, y);
            }
        }
    }
}

function incrementNearbyNumbers(x, y) {
    let xsub = x - 1;
    let xadd = x + 1;
    let ysub = y - 1;
    let yadd = y + 1;

    if(baseMatriz[x] !== undefined) {
        if(baseMatriz[x][ysub] !== undefined && baseMatriz[x][ysub].value !== BOMB_SYMBOL) {
            baseMatriz[x][ysub].value++
        }
        if(baseMatriz[x][yadd] !== undefined && baseMatriz[x][yadd].value !== BOMB_SYMBOL) {
            baseMatriz[x][yadd].value++
        }
    }
    if(baseMatriz[xsub] !== undefined) {
        if(baseMatriz[xsub][ysub] !== undefined && baseMatriz[xsub][ysub].value !== BOMB_SYMBOL) {
            baseMatriz[xsub][ysub].value++
        }
        if(baseMatriz[xsub][yadd] !== undefined && baseMatriz[xsub][yadd].value !== BOMB_SYMBOL) {
            baseMatriz[xsub][yadd].value++
        }
        if(baseMatriz[xsub][y] !== undefined && baseMatriz[xsub][y].value !== BOMB_SYMBOL) {
            baseMatriz[xsub][y].value++
        }
    }
    if(baseMatriz[xadd] !== undefined) {
        if(baseMatriz[xadd][ysub] !== undefined && baseMatriz[xadd][ysub].value !== BOMB_SYMBOL) {
            baseMatriz[xadd][ysub].value++
        }
        if(baseMatriz[xadd][yadd] !== undefined && baseMatriz[xadd][yadd].value !== BOMB_SYMBOL) {
            baseMatriz[xadd][yadd].value++
        }
        if(baseMatriz[xadd][y] !== undefined && baseMatriz[xadd][y].value !== BOMB_SYMBOL) {
            baseMatriz[xadd][y].value++
        }
    }
}

function clearOutput() {
    OutputElement.innerHTML = '';
}

function applyGridInOutputElement () {
    OutputElement.style = `grid-template-rows: repeat(${size}, 1fr);grid-template-columns: repeat(${size}, 1fr);`;
}

function getFieldElement(x,y) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('field', 'closed')
    
    newDiv.addEventListener('click', (event) => {
        event.preventDefault();

        clickElement(x,y)
    })
    
    newDiv.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        toogleBlockedPosition(x,y)
    })
    
    OutputElement.appendChild(newDiv);

    return newDiv
}

function clickElement(x,y) {
    if(!baseMatriz[x][y].blocked) {
        if(baseMatriz[x][y].value === BOMB_SYMBOL) {
            alert('Você perdeu!');
            openAll()
        } else {
            openElement(x,y);
        }
    }
}

function openAll() {
    for (let x = 0; x < baseMatriz.length; x++) {
        for (let y = 0; y < baseMatriz[x].length; y++) {
            openElement(x,y);
        }
    }
}

function openElement(x, y) {
    if(baseMatriz[x][y].open) {
        return;
    }

    if(!baseMatriz[x][y].blocked) {
        setOpenedElement(x,y)
        
        if(baseMatriz[x][y].value === 0) {
            openNearbyFields(x,y)
        }
    }
}

function setOpenedElement(x,y) {
    baseMatriz[x][y].element.innerHTML = baseMatriz[x][y].value
    baseMatriz[x][y].element.classList.remove('closed')
    baseMatriz[x][y].open = true;
    baseMatriz[x][y].blocked = false;
}

function openNearbyFields(x,y) {
    let xsub = x - 1;
    let xadd = x + 1;
    let ysub = y - 1;
    let yadd = y + 1;

    if(baseMatriz[x] !== undefined ) {
        if(baseMatriz[x][ysub] !== undefined) {
            if(baseMatriz[x][ysub].value == 0) {
                openElement(x,ysub)
            } else {
                setOpenedElement(x,ysub)
            }
        }

        if(baseMatriz[x][yadd] !== undefined) {
            if (baseMatriz[x][yadd].value == 0) {
                openElement(x,yadd)
            } else {
                setOpenedElement(x,yadd)
            }
            }
    }
    if(baseMatriz[xsub] !== undefined) {
        if(baseMatriz[xsub][ysub] !== undefined) {
            if(baseMatriz[xsub][ysub].value == 0) {
                openElement(xsub,ysub)
            } else {
                setOpenedElement(xsub,ysub)
            }
        }

        if(baseMatriz[xsub][yadd] !== undefined) {
            if(baseMatriz[xsub][yadd].value == 0) {
                openElement(xsub,yadd)
            } else {
                setOpenedElement(xsub,yadd)
            }
        }

        if(baseMatriz[xsub][y] !== undefined) {
            if(baseMatriz[xsub][y].value == 0) {
                openElement(xsub,y)
            } else {
                setOpenedElement(xsub,y)
            }
        }
    }
    if(baseMatriz[xadd] !== undefined ) {
        if(baseMatriz[xadd][ysub] !== undefined){
            if(baseMatriz[xadd][ysub].value == 0) {
                openElement(xadd,ysub)
            } else {
                setOpenedElement(xadd,ysub)
            }
        }

        if(baseMatriz[xadd][yadd] !== undefined){
            if(baseMatriz[xadd][yadd].value == 0) {
                openElement(xadd,yadd)
            } else {
                setOpenedElement(xadd,yadd)   
            }
        }

        if(baseMatriz[xadd][y] !== undefined){
            if(baseMatriz[xadd][y].value == 0) {
                openElement(xadd,y)
            } else {
                setOpenedElement(xadd,y)
            }
        }
    }
}

function toogleBlockedPosition(x,y) {
    if(baseMatriz[x][y].open) {
        return;
    }

    baseMatriz[x][y].blocked = !baseMatriz[x][y].blocked;

    if(baseMatriz[x][y].blocked) {
        baseMatriz[x][y].element.innerHTML = 'X';

        if(baseMatriz[x][y].value === BOMB_SYMBOL) {
            countCorrectBlockedFields++;
        }
    } else {
        baseMatriz[x][y].element.innerHTML = '';
        
        if(baseMatriz[x][y].value === BOMB_SYMBOL) {
            countCorrectBlockedFields--;
        }
    }
    checkVictory();
}

function checkVictory() {
    if(countCorrectBlockedFields === bombs) {
        alert('Você venceu!')
        openAll()
    }
}