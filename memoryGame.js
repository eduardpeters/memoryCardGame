const gameState = {
    playerOneName: "",
    playerTwoName: "",
    playerOneScore: 0,
    playerTwoScore: 0,
    maxPoints: 0,
    playerOneTurn: true,
    currentCards: []
};

function initializeGame() {
    const playerOneName = document.getElementById("playerOneInput").value;
    const playerTwoName = document.getElementById("playerTwoInput").value;
    const numberOfCards = parseInt(document.getElementById("level").value);
    if (validateInput(playerOneName, playerTwoName, numberOfCards)) {
        inputUser(playerOneName, playerTwoName);
        drawFirstMove();
        gameState.maxPoints = numberOfCards / 2;
        document.getElementById("spread").innerHTML = `Remaining turns: ${gameState.maxPoints - gameState.playerOneScore - gameState.playerTwoScore}`;
        placeBoard(numberOfCards);
        document.getElementById("userForm").classList.remove("userForm");
        document.getElementById("userForm").classList.add("not-displayed");
        setTimeout(() => {
            document.getElementById("turnSelector").classList.remove("turnSelector");
            document.getElementById("turnSelector").classList.add("not-displayed");
            document.getElementById("gameScreen").classList.remove("not-displayed");
            document.getElementById("gameScreen").classList.add("gameScreen");
        }, 3000);
    }
}

function validateInput(playerOneName, playerTwoName, numberOfCards) {
    if (playerOneName.length < 3 || playerTwoName.length < 3) {
        alert("Player names must be at least three characters");
        return (false);
    }
    if (!numberOfCards) {
        alert("Select how many cards to play with");
        return (false);
    }
    if (numberOfCards < 12 || numberOfCards > 48 || numberOfCards % 2 !== 0) {
        alert("Not a valid number of cards");
        return (false);
    }
    return (true);
}

function inputUser(playerOneName, playerTwoName) {
    document.getElementById("playerOneName").innerHTML = playerOneName;
    document.getElementById("playerTwoName").innerHTML = playerTwoName;
    document.getElementById("playerOneTurn").innerHTML = playerOneName;
    document.getElementById("playerTwoTurn").innerHTML = playerTwoName;
    gameState.playerOneName = playerOneName;
    gameState.playerTwoName = playerTwoName;
    updateScore();
}

function updateScore() {
    document.getElementById("playerOneScore").innerHTML = gameState.playerOneScore;
    document.getElementById("playerTwoScore").innerHTML = gameState.playerTwoScore;
    document.getElementById("spread").innerHTML = `Remaining turns: ${gameState.maxPoints - gameState.playerOneScore - gameState.playerTwoScore}`;
}

function drawFirstMove() {
    const playerOneTag = document.getElementById("playerOneTurn");
    const playerTwoTag = document.getElementById("playerTwoTurn");
    gameState.playerOneTurn = Math.random() < 0.5 ? true : false;
    gameState.playerOneTurn ? document.getElementById("playerOneName").classList.add("currentTurn") : document.getElementById("playerTwoName").classList.add("currentTurn");
    document.getElementById("turnSelector").classList.remove("not-displayed");
    document.getElementById("turnSelector").classList.add("turnSelector");
    const selectionInterval = setInterval(() => alternateSelected(playerOneTag, playerTwoTag), 250);
    setTimeout(() => {
        clearInterval(selectionInterval);
        document.getElementById("turnNames").classList.remove("turnNames");
        document.getElementById("turnNames").classList.add("not-displayed");
        document.getElementById("firstMove").classList.remove("not-displayed");
        document.getElementById("firstMove").classList.add("firstMove");
        document.getElementById("firstMove").innerHTML = `${gameState.playerOneTurn ? gameState.playerOneName : gameState.playerTwoName} has the first move!`;
    }, 2000);
}

function alternateSelected(playerOneTag, playerTwoTag) {
    playerOneTag.classList.add("playerSelected");
    setTimeout(() => {
        playerOneTag.classList.remove("playerSelected");
        playerTwoTag.classList.add("playerSelected");
    }, 125);
    setTimeout(() => {
        playerTwoTag.classList.remove("playerSelected");
    }, 250);
}

function placeBoard(numberOfCards) {
    const boardOrder = randomOrderArray(numberOfCards);
    const parent = document.getElementById("board");
    boardOrder.forEach(pairValue => {
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newDiv.className = "card";
        newDiv.dataset.value = pairValue;
        newDiv.addEventListener("click", handleCardClick);
        newDiv.appendChild(newP);
        parent.appendChild(newDiv);
    });
}

function randomOrderArray(numberOfCards) {
    const randomArray = [];
    for (let i = 0; i < numberOfCards / 2; i++)
        randomArray.push(i, i);
    for (let i = randomArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [randomArray[i], randomArray[randomIndex]] = [randomArray[randomIndex], randomArray[i]];
    }
    return (randomArray);
}

function handleCardClick(event) {
    const currentCard = event.target;
    if (currentCard.tagName === "P")
        return;
    if (gameState.currentCards.indexOf(currentCard) === -1 && gameState.currentCards.length < 2) {
        gameState.currentCards.push(currentCard);
        currentCard.classList.add("cardFlipping");
        setTimeout(() => {
            currentCard.classList.remove("cardFlipping");
            currentCard.children[0].innerHTML = currentCard.dataset.value
        }, 300);
        if (gameState.currentCards.length === 2)
            setTimeout(checkOutcome, 1500);
    }
}

function checkOutcome() {
    if (gameState.currentCards[0].dataset.value === gameState.currentCards[1].dataset.value) {
        gameState.playerOneTurn ? gameState.playerOneScore++ : gameState.playerTwoScore++;
        removeCardVisibility();
        updateScore();
    }
    else {
        gameState.playerOneTurn = !gameState.playerOneTurn;
        if (gameState.playerOneTurn) {
            document.getElementById("playerOneName").classList.add("currentTurn");
            document.getElementById("playerTwoName").classList.remove("currentTurn");
        }
        else {
            document.getElementById("playerTwoName").classList.add("currentTurn");
            document.getElementById("playerOneName").classList.remove("currentTurn");
        }

        revertCardFaces();
    }
    gameState.currentCards = [];
    if (gameState.playerOneScore + gameState.playerTwoScore === gameState.maxPoints)
        endGame();
}

function removeCardVisibility() {
    gameState.currentCards.forEach(card => {
        card.classList.add("cardFading");
        setTimeout(() => {
            card.dataset.faceUp = 0;
            card.style.visibility = "hidden";
            card.classList.remove("cardFading");
        }, 300);
    });
}

function revertCardFaces() {
    gameState.currentCards.forEach(card => {
        card.classList.add("cardFlipping");
        setTimeout(() => {
            card.children[0].innerHTML = "";
            card.dataset.faceUp = 0;
            card.classList.remove("cardFlipping");
        }, 150);
    });
}

function endGame() {
    if (gameState.playerOneScore === gameState.playerTwoScore) {
        document.getElementById("winner").innerHTML = "The game ends in a tie!";
        document.getElementById("emoji").innerHTML = "&#129309";
    }
    else {
        const finalResult = gameState.playerOneScore > gameState.playerTwoScore ? gameState.playerOneName : gameState.playerTwoName;
        document.getElementById("winner").innerHTML = `${finalResult} has won this match!`;
        document.getElementById("emoji").innerHTML = "&#127881;";
    }
    document.getElementById("gameScreen").classList.remove("gameScreen");
    document.getElementById("gameScreen").classList.add("not-displayed");
    document.getElementById("endScreen").classList.remove("not-displayed");
    document.getElementById("endScreen").classList.add("endScreen");
}

function resetGame() {
    window.location.reload();
}