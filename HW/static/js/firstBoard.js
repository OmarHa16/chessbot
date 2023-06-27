// Get User Moves From Server 
function getMoves() {
    let req = new XMLHttpRequest();
    req.open("GET", "GetMovesOne", false);
    req.onreadystatechange = function() {
        if(req.status === 200 && req.readyState === 4) {
            if(! JSON.parse(req.responseText)['end']) {
                printMoves(JSON.parse(req.responseText)["moves"]);
                moveByClick();
            }
            else {
                let result = JSON.parse(req.responseText)["result"];
                printResult(result);
            }
        }
    }
    req.send()
}
// Get Bot Move From Server
function botMove() {
    let req = new XMLHttpRequest();
    req.open("GET", "BotMoveOne", false);
    req.onreadystatechange = function() {
        if(req.status === 200 && req.readyState === 4) {
            if(! JSON.parse(req.responseText)["end"] == true) {
                let move = JSON.parse(req.responseText)["move"];
                let hasSqr = document.querySelector(`#${move[0] + move[1]}`);
                let target = document.querySelector(`#${move[2] + move[3]}`);
                let piece = hasSqr.children[0];
                hasSqr.replaceChildren();
                target.replaceChildren(piece);
                renderMoves();
            }
            else {
                let result = JSON.parse(req.responseText)["result"];
                printResult(result);
            }
        }
    }
    req.send();
}
// Send User Move To The Server
function userMove(move) {
    let moves = document.querySelectorAll(".cont span");
    moves.forEach((move) => {
        if(! move.classList.contains("dis")) {
            move.classList.add("dis");
        }
    });
    let req = new XMLHttpRequest();
    req.open("GET", "GetUserMoveOne?move="+move, false);
    req.onreadystatechange = function() {
        setTimeout(() => {
            botMove();
            getMoves();
        }, 500);
    }
    req.send();
}
// To Print Moves In Div
function printMoves(moves) {
    let movesContainer = document.querySelector(".cont");
    movesContainer.replaceChildren();
    for(let i = 0; i < moves.length; i++) {
        let span = document.createElement("span");
        span.appendChild(document.createTextNode(moves[i]));
        movesContainer.appendChild(span);
    }
    if(movesContainer.offsetHeight > 300) {
        movesContainer.style.overflowY = "scroll";
    }
}
// To Ask User If Want To Start First
function startFirst() {
    let msg = document.createElement("div");
    msg.className = "msg";
    let layer = document.createElement("div");
    layer.className = "layer";
    let ask = document.createElement("h2");
    ask.appendChild(document.createTextNode("Do You Want To Start First ?"));
    let contAnswer = document.createElement("div");
    let yes = document.createElement("span");
    yes.className = "yes";
    yes.appendChild(document.createTextNode("Yes"));
    let no = document.createElement("span");
    no.className = "No";
    no.appendChild(document.createTextNode("No"));
    contAnswer.appendChild(yes);
    contAnswer.appendChild(no);
    msg.appendChild(ask);
    msg.appendChild(contAnswer);
    document.body.append(layer);
    document.body.append(msg);
}
// To Make Move When User Click On Move
function moveByClick() {
    let moves = document.querySelectorAll(".cont span");
    moves.forEach((move) => {
        move.onclick = function() {
            let move = this.innerText;
            let hasSqr = document.querySelector(`#${move[0]+move[1]}`);
            let target = document.querySelector(`#${move[2]+move[3]}`);
            let piece = hasSqr.children[0];
            hasSqr.replaceChildren();
            target.replaceChildren(piece);
            renderMoves();
            userMove(move);
        }
    });
}
// To Refresh Moves Counter 
function renderMoves() {
    let counterContainer = document.querySelector(".row .moves");
    let numberOfMoves = counterContainer.innerText.split(":")[1];
    numberOfMoves++;
    counterContainer.replaceChildren(document.createTextNode("Moves: " + numberOfMoves));
}
// Render Time Match
function matchTime() {
    let timeContainer = document.querySelector(".row .time");
    let time = 0;
    match = setInterval(() => {
        time++;
        if(time < 60) {
            timeContainer.replaceChildren(document.createTextNode("Time: " + time + "s"));
        }
        else if(time % 60 == 0) {
            timeContainer.replaceChildren(document.createTextNode("Time: " + time / 60 + "m"));
        }
    }, 1000); 
}
// To Show Warning Messages
function warn(msg) {
    let form = document.forms[0];
    if (form.children[form.childElementCount - 1].classList.contains("warning")) {
        form.children[form.childElementCount - 1].remove();
    }
    let warn = document.createElement("span");
    warn.className = "warning";
    warn.appendChild(document.createTextNode(msg));
    form.appendChild(warn);
}
// To Tell User That Click On The Move Will Move
function hint() {
    let hintMsg = document.querySelector(".main .hint");
    hintMsg.style.left = "0px";
    setTimeout(() => {
        hintMsg.style.left = "-440px";
    }, 3000);
}
// To Print Result
function printResult(res) {
    let container = document.createElement("div");
    container.className = "result";
    let title = document.createElement("h2");
    title.appendChild(document.createTextNode("Game Over"));
    let anly = document.createElement("p");
    clearInterval(match);
    anly.appendChild(document.createTextNode(`Game Finished With ${document.querySelector(".row .moves").innerText.split(":")[1]} Moves in ${document.querySelector(".row .time").innerText.split(":")[1]}`));
    let resultP = document.createElement("p");
    resultP.appendChild(document.createTextNode(`Result: ${res}`));
    let restBtn = document.createElement("span");
    restBtn.className = "restart";
    restBtn.appendChild(document.createTextNode("Restart"));
    let layer = document.createElement("div");
    layer.className = "layer";
    container.appendChild(title);
    container.appendChild(anly);
    container.appendChild(resultP);
    container.appendChild(restBtn);
    document.body.appendChild(layer);
    document.body.appendChild(container);
    let disAll = document.querySelectorAll(".main span:not(.home, .restart), .main input");
    disAll.forEach((ele) => {
        ele.classList.add("dis");
    });
    restBtn.onclick = () => {
        window.location.reload();
    };
}
// Paint Board
let rowSquares = document.querySelectorAll(".board .row");
let restart = document.querySelector(".restart");
for(let row = 0; row < 8; row++) {
    let squares = rowSquares[row].children;
    for(let col = 0; col < 8; col++) {
        if((row % 2 == 0 && col % 2 != 0) || (row % 2 != 0 && col % 2 == 0)) {
            squares[col].style.backgroundColor = "#0c7b93";
        }
        else {
            squares[col].style.backgroundColor = "white";
        }
    }
}
// To Make Match Time Accissable In Global Scope
let match;
// Handle Restart And Start Buttons
let gameState = false;
let start = document.querySelector(".start");
restart.classList.add("dis");
start.onclick = function() {
    start.classList.add("dis");
    restart.classList.remove("dis");
    gameState = true;
    startFirst();
    let yesOrNo = document.querySelectorAll(".msg div span");
    yesOrNo.forEach((e)=>{
        e.onclick = function() {
            if(e.innerText.toLowerCase() == "yes") {
                document.querySelector(".msg").remove();
                document.querySelector(".layer").remove();
                matchTime();
                getMoves();
                moveByClick();
                hint();
            }
            else {
                // Get Bot Move
                botMove();
                document.querySelector(".msg").remove();
                document.querySelector(".layer").remove();
                matchTime();
                getMoves();
                moveByClick();
                hint();
            }
        }
    });
}
// Handle Sending Moves
let moveInp = document.querySelector("#mov");
document.querySelector("[value='move']").onclick = function(e) {
    e.preventDefault();
    let val = moveInp.value;
    if(gameState == true && val == "") {
        warn("\"Enter Move Like a2a3\"")
    }
    if(gameState == true && val != "") {
        let contMoves = document.querySelector(".cont");
        let found = false;
        for(let i = 0; i < contMoves.childElementCount; i++) {
            if(val == contMoves.children[i].innerText) {
                found = true;
                moveInp.value = "";
                break;
            }
        }
        if(found) {
            // To Check If There A Warning Message Or Not
            let form = document.forms[0];
            if(form.children[form.childElementCount - 1]) {
                form.children[form.childElementCount - 1].remove();
            }
            let hasSqr = document.querySelector(`#${val[0]+val[1]}`);
            let target = document.querySelector(`#${val[2]+val[3]}`);
            let piece = hasSqr.children[0];
            hasSqr.replaceChildren();
            target.replaceChildren(piece);
            renderMoves();
            userMove(val);
        }
        else {
            warn("\"This Isn't Available Move\"");
        }
    }
}
// Restart The Game
document.querySelector(".restart").onclick = () => {
    window.location.reload();
};