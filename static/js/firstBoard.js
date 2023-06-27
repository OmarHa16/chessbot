// Get User Moves From Server 
function getMoves(fun) {
    let req = new XMLHttpRequest();
    req.open("GET", "GetMovesOne", false);
    req.onreadystatechange = function() {
        if(req.status === 200 && req.readyState === 4) {
            fun(JSON.parse(req.responseText));
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
                target.replaceChildren();
                let pice = hasSqr.children[0];
                hasSqr.replaceChildren();
                target.appendChild(pice);
                // Show User Moves
                let movesContainer = document.querySelector(".cont");
                let moves = JSON.parse(req.responseText)['moves'];
                for(let i = 0; i < moves.length; i++) {
                    let span = document.createElement("span");
                    console.log(moves[i])
                    span.appendChild(document.createTextNode(moves[i]));
                    movesContainer.appendChild(span);
                }
                if(movesContainer.offsetHeight > 300) {
                    movesContainer.style.overflowY = "scroll";
                }
            }
            else {
                // Call Result Message
            }
        }
    }
    req.send();
}
// Send User Move To The Server
function userMove(move) {
    let req = new XMLHttpRequest();
    req.open("GET", "GetUserMoveOne?move="+move, false);
    req.onreadystatechange = function() {
        botMove();
    }
    req.send();
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
// Paint Board
let rowSquares = document.querySelectorAll(".board .row");
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
// Handle Restart And Start Buttons
let gameState = false;
let start = document.querySelector(".start");
let restart = document.querySelector(".restart");
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
                    getMoves(function(response) {
                        let movesContainer = document.querySelector(".cont");
                        let moves = response['moves'];
                        for(let i = 0; i < moves.length; i++) {
                            let span = document.createElement("span");
                            span.appendChild(document.createTextNode(moves[i]));
                            movesContainer.appendChild(span);
                        }
                        if(movesContainer.offsetHeight > 300) {
                            movesContainer.style.overflowY = "scroll";
                        }
                    });
            }
            else {
                // Get Bot Move
                botMove();
                document.querySelector(".msg").remove();
                document.querySelector(".layer").remove();
                getMoves(function(response) {
                    let movesContainer = document.querySelector(".cont");
                    let moves = response['moves'];
                    for(let i = 0; i < moves.length; i++) {
                        let span = document.createElement("span");
                        span.appendChild(document.createTextNode(moves[i]));
                        movesContainer.appendChild(span);
                    }
                    if(movesContainer.offsetHeight > 300) {
                        movesContainer.style.overflowY = "scroll";
                    }
                });
            }
        }
    });
}
// Handle Sending Moves
let moveInp = document.querySelector("#mov");
document.querySelector("[value='move']").onclick = function(e) {
    e.preventDefault();
    let val = moveInp.value;
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
            let hasSqr = document.querySelector(`#${val[0]+val[1]}`);
            let target = document.querySelector(`#${val[2]+val[3]}`);
            let pice = hasSqr.children[0];
            hasSqr.replaceChildren();
            target.replaceChildren();
            target.appendChild(pice);
            userMove(moveInp.value);
            contMoves.replaceChildren();
            console.log("Hello")
        }
    }
}