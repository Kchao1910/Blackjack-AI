let theme = {
  darkMode: false
};

// Theme is an object that holds the properties of a certain theme (dark mode and light mode)
function Theme(primaryBackgroundColor, secondaryBackgroundColor, color, brightness, themeType, cardTheme) {
  this.primaryBackgroundColor = primaryBackgroundColor;
  this.secondaryBackgroundColor = secondaryBackgroundColor;
  this.color = color;
  this.brightness = brightness;
  this.themeType = themeType;
  this.cardTheme = cardTheme;
}

let darkTheme = new Theme("rgba(0, 0, 0, 0.9)", "rgb(39, 39, 39,)", "white", "brightness_5", "dark-theme", "d-card-theme");
let lightTheme = new Theme("white", "white", "black", "brightness_5", "light-theme", "l-card-theme");

function setTheme(theme) {
  document.body.style = `background-color: ${theme.primaryBackgroundColor}; color: ${theme.color}`;
  document.getElementsByTagName("header")[0].style = `background-color: ${theme.secondaryBackgroundColor}`;
  document.querySelector(".material-icons").textContent = theme.brightness;
  document.querySelector("#play-button").className = theme.themeType;
  document.querySelector("#reset-button").className = theme.themeType;
  document.querySelector("#show-console-button").className= theme.themeType;
  changeCardStyles(playerCards, theme);
  changeCardStyles(dealerCards, theme);
}

function changeCardStyles(nodeList, theme){
  for (let element of nodeList) {
    element.id = theme.cardTheme;
  }
}

(function() {
  document.querySelector(".material-icons").addEventListener("click", function() {
    changeTheme();
  });
})();

function changeTheme() {
  if (theme.darkMode === false) {
    theme.darkMode = true;
    setTheme(darkTheme);
  } else {
    theme.darkMode = false;
    setTheme(lightTheme);
  }
}


let textOutput = document.querySelector("#text-output");

(function() {
  document.querySelector("#play-button").addEventListener("click", function() {
    game();
  });
  document.querySelector("#reset-button").addEventListener("click", function() {
    resetGame();
  })
  document.querySelector("#show-console-button").addEventListener("click", function() {
    if (textOutput.style.visibility === 'hidden') {
      textOutput.style.visibility = 'visible';
    }
    else
    {
      textOutput.style.visibility = 'hidden';
    }
  })
})();

let numGamesCounter = 1;

let playerData = {
  aceSwitch: false,
  cardValues: [],
  numberOfCards: 0,
  over21: false,
  hardTable: false,
  totalScore: 0,
  turnOver: false,
  wins: 0
};

let dealerData = {
  aceSwitch: false,
  cardValues: [],
  faceCard: 0,
  softHand: false,
  numberOfCards: 0,
  over21: false,
  totalScore: 0,
  turnOver: false,
  wins: 0
};

let playerTotal = document.querySelector("#player-total");
let dealerTotal = document.querySelector("#dealer-total");

let playerScore = document.querySelector("#player-score");
let dealerScore = document.querySelector("#dealer-score");

let playerCards = document.querySelectorAll(".player-card");
let dealerCards = document.querySelectorAll(".dealer-card");

let cards = [
  1, 1, 1, 1,
  2, 2, 2, 2,
  3, 3, 3, 3,
  4, 4, 4, 4,
  5, 5, 5, 5,
  6, 6, 6, 6,
  7, 7, 7, 7,
  8, 8, 8, 8,
  9, 9, 9, 9,
  10, 10, 10, 10,
  10, 10, 10, 10,
  10, 10, 10, 10,
  10, 10, 10, 10
];

let cardClone = [...cards];

function game() {
  let shuffledDeck = fisherYatesShuffle(cardClone);
  // Initial turn for both players
  playerTurn(playerData, playerCards, playerTotal, shuffledDeck);
  playerTurn(playerData, playerCards, playerTotal, shuffledDeck);
  playerTurn(dealerData, dealerCards, dealerTotal, shuffledDeck);
  playerTurn(dealerData, dealerCards, dealerTotal, shuffledDeck);

  // set dealer face card for table decision tree
  dealerData.faceCard = dealerData.cardValues[0];

  // Initial check (Blackjack or tie)
  getMaximumValue(playerData, playerTotal);
  getMaximumValue(dealerData, dealerTotal);

  if ((playerData.totalScore === 21 && dealerData.totalScore === 21) || ((dealerData.totalScore === 21 && playerData.totalScore < 21))) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Dealer Wins!\n';
    stopGame();
    return;
  }

  if (playerData.totalScore === 21 && dealerData.totalScore < 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Player Wins!\n';
    stopGame();
    return;
  }

  if (playerData.totalScore <= 21 && dealerData.totalScore > 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Player Wins!\n';
    stopGame();
    return;
  }

  if (playerData.totalScore > 21 && dealerData.totalScore <= 21) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Dealer Wins!\n';
    stopGame();
    return;
  }

  if (playerData.totalScore > 21 && dealerData.totalScore > 21) {
    textOutput.innerHTML = textOutput.innerHTML + 'Draw!\n';
    stopGame();
    return;
  }

  // Table based decision making section

  softOrHard();

  textOutput.innerHTML = textOutput.innerHTML + '===== Turn ' + numGamesCounter +  ' =====' + '\n';

  while (playerData.turnOver === false) {
    hardOrSoft(shuffledDeck);
    softOrHard();
    playerTotal.textContent = playerData.totalScore;
  }

  if (playerData.numberOfCards === 5 && playerData.totalScore <= 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Player Wins!\n';
    stopGame();
    return;
  }

  if (playerData.totalScore > 21) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Dealer Wins!\n';
    stopGame();
    return;
  }

  while (dealerData.turnOver === false)  {
    checkSoftHand();
    dealerAI(shuffledDeck);
    dealerTotal.textContent = dealerData.totalScore;
  }

  if (dealerData.numberOfCards === 5 && dealerData.totalScore >= playerData.totalScore) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Dealer Wins!\n';
    stopGame();
    return;
  }

  if (dealerData.totalScore > 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Player Wins!\n';
    stopGame();
    return;
  }

  if (dealerData.totalScore >= playerData.totalScore) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Dealer Wins!\n';
    stopGame();
    return;
  }

  if (playerData.totalScore > dealerData.totalScore) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    textOutput.innerHTML = textOutput.innerHTML + 'Player Wins!\n';
    stopGame();
    return;
  }
}

function stopGame() {
  textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\n";
  textOutput.innerHTML = textOutput.innerHTML + " Dealer Score: " + dealerData.totalScore + "\n";

  let playButton = document.querySelector("#play-button");
  let resetButton = document.querySelector("#reset-button");
  playButton.disabled = true;
  resetButton.disabled = false;

  textOutput.scrollTop = textOutput.scrollHeight;
}

function getCard(shuffledDeck) {
  return shuffledDeck.pop();
}

function playerTurn(player, nodeList, playerTotal, shuffledDeck) {
  if (player.numberOfCards === 5) {
    return;
  }

  let card = getCard(shuffledDeck);
  let nextCardPosition = getCardPlacement(player);

  displayCard(card, nextCardPosition, nodeList);

  player.cardValues.push(card);
  player.numberOfCards++;
  player.totalScore += card;

  playerTotal.textContent = player.totalScore;
}

function getCardPlacement(player) {
  return player.numberOfCards;
}

// this function displays the card number
function displayCard(card, nextCardPosition, nodeList) {
  currentCard = nodeList[nextCardPosition];
  cardAssets = currentCard.childNodes;
  cardAssets[1].textContent = `${card}`;
  cardAssets[3].setAttribute("class", "fab fa-d-and-d dragon ");
  cardAssets[5].textContent = `${card}`;
}

function getMaximumValue(player, playerTotal) {
  let one = player.cardValues.filter(value => value === 1);
  let ten = player.cardValues.filter(value => value === 10);

  if (one.length === 1 && ten.length === 1) {
    player.totalScore = 21;
    playerTotal.textContent = 21;
    player.aceSwitch = true;
  }
}

function resetGame() {
  resetCards(playerCards);
  resetCards(dealerCards);

  numGamesCounter += 1;

  playerData.aceSwitch = false;
  playerData.cardValues = [];
  playerData.numberOfCards = 0,
  playerData.over21 = false;
  playerData.hardTable = false;
  playerData.totalScore = 0;
  playerData.turnOver = false;

  dealerData.aceSwitch = false;
  dealerData.cardValues = [];
  dealerData.faceCard = 0,
  dealerData.softHand = false;
  dealerData.numberOfCards = 0;
  dealerData.over21 = false;
  dealerData.totalScore = 0;
  dealerData.turnOver = false;

  playerTotal.textContent = '0';
  dealerTotal.textContent = '0';

  let playButton = document.querySelector("#play-button");
  let resetButton = document.querySelector("#reset-button");
  playButton.disabled = false;
  resetButton.disabled = true;

  cardClone = [...cards];
}

// this function creates blank cards
function resetCards(nodeList) {
  for (let element of nodeList) {
    element = element.childNodes;
    element[1].textContent = '';
    element[3].setAttribute("class", "fab dragon");
    element[5].textContent = '';
  }
}

// Fisher-Yates algorithm
function fisherYatesShuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function hardOrSoft(shuffledDeck) {
  if (playerData.hardTable === true) {
    hardTable(shuffledDeck);
  } else {
    changeAce(playerData);
    softTable(shuffledDeck);
    changeAce(playerData);
  }
}

// hard table
function hardTable(shuffledDeck) {
  // base case
  if (playerData.numberOfCards === 5) {
    return;
  }

  if (playerData.totalScore >= 5 && playerData.totalScore <= 11) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 12 && dealerData.faceCard >= 1 && dealerData.faceCard <= 3 && dealerData.faceCard >= 7) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 12 && dealerData.faceCard >= 4 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards >= 3) {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
      stand(playerData);
    }
  } else if (playerData.totalScore === 13 && dealerData.faceCard >= 2 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards >= 3) {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
      stand(playerData);
    }
  } else if (playerData.totalScore === 13 && (dealerData.faceCard >= 7 || dealerData.faceCard === 1)) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 14 && dealerData.faceCard >= 2 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards === 4) {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
      stand(playerData);
    }
  } else if (playerData.totalScore === 14 && (dealerData.faceCard >= 7 && dealerData.faceCard === 1)) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 15 && dealerData.faceCard >= 2 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards === 4) {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
      stand(playerData);
    }
  } else if (playerData.totalScore === 15 && (dealerData.faceCard >= 7 || dealerData.faceCard === 1)) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 16 && dealerData.faceCard >= 2 && dealerData.faceCard <= 3) {
    if (playerData.numberOfCards === 4) {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
      stand(playerData);
    }
  } else if (playerData.totalScore === 16 && dealerData.faceCard >= 4 && dealerData.faceCard <= 6) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
    stand(playerData);
  } else if (playerData.totalScore === 17 && dealerData.faceCard >= 2 && dealerData.faceCard <= 8) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
    stand(playerData);
  } else if (playerData.totalScore === 17 && (dealerData.faceCard >= 9 && dealerData.faceCard === 1)) {
    if (playerData.numberOfCards === 4) {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
      stand(playerData);
    }
  } else {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
    stand(playerData);
  }
}

// soft table
function softTable(shuffledDeck) {
  // base case
  if (playerData.numberOfCards === 5) {
    return;
  }

  if ((playerData.totalScore >= 12 && playerData.totalScore <= 17) ||
      (playerData.totalScore === 18 && (dealerData.faceCard >= 3 && dealerData.faceCard <= 6)))
  {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  // 2-away Charlie
  else if ((playerData.totalScore === 18 && playerData.numberOfCards === 3)) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  else if (playerData.totalScore === 19 && playerData.numberOfCards === 3 && dealerData.faceCard === 10) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  // 1-away Charlie
  else if ((playerData.totalScore >= 19 && playerData.totalScore <= 21) && playerData.numberOfCards === 4) {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nHit...\n";
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  else {
    textOutput.innerHTML = textOutput.innerHTML + " Player Score: " + playerData.totalScore + "\nStand.\n";
    stand(playerData);
  }
}

// this function adds the first card on top of the deck into the player's hand
function hit(player, playerTotal, playerCards, shuffledDeck) {
  let card = getCard(shuffledDeck);
  let nextCardPosition = getCardPlacement(player);

  displayCard(card, nextCardPosition, playerCards);

  player.cardValues.push(card);
  player.numberOfCards++;
  player.totalScore += card;

  playerTotal.textContent = player.totalScore;

  if (player.totalScore >= 21) {
    player.turnOver = true;
  }
}

// this function ends the player's turn
function stand(player) {
  player.turnOver = true;
}

// this function determines which table to use depending on if the player's hand contains an ace
function softOrHard() {
  if ((playerData.cardValues.filter(value => value === 1)).length >= 1) {
    playerData.hardTable = false;
  } else {
    playerData.hardTable = true;
  }
}

// this function adds or subtracts 10 from the total hand 
function changeAce() {
  if (playerData.aceSwitch === false && playerData.totalScore <= 11) {
    playerData.aceSwitch = true;
    playerData.totalScore += 10;
  }

  if (playerData.aceSwitch === true && playerData.totalScore > 21) {
    playerData.aceSwitch = false;
    playerData.totalScore -= 10;
  }
}

// this function acts as the main interface for the dealer AI
function dealerAI(shuffledDeck) {
  if (dealerData.totalScore >= 17 && dealerData.aceSwitch === false) {
    stand(dealerData);
  } else if (dealerData.totalScore === 17 && dealerData.aceSwitch === true) {
    hit(dealerData, dealerTotal, dealerCards, shuffledDeck);
  } else if (dealerData.totalScore <= 16) {
    hit(dealerData, dealerTotal, dealerCards, shuffledDeck);
  } else {
    alert("Uh Oh! Something broke!");
  }
}

function checkSoftHand() {
  if (dealerData.cardValues.findIndex(getIndex) !== -1 && dealerData.softHand === false) {
    dealerData.softHand = true;
  } else {
    dealerData.softHand = false;
  }
}

function getIndex(element) {
  return element === 1;
}
