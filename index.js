(function() {
  document.querySelector("#play-button").addEventListener("click", function() {
    game();
  });
  document.querySelector("#reset-button").addEventListener("click", function() {
    resetGame();
  })
})();

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

let cardClone = cards;

function game() {
  resetGame();

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
    stopGame();
    return;
  }

  if (playerData.totalScore === 21 && dealerData.totalScore < 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    stopGame();
    return;
  }

  if (playerData.totalScore <= 21 && dealerData.totalScore > 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    stopGame();
    return;
  }

  if (playerData.totalScore > 21 && dealerData.totalScore <= 21) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    stopGame();
    return;
  }

  if (playerData.totalScore > 21 && dealerData.totalScore > 21) {
    stopGame();
    return;
  }

  console.log(dealerData.cardValues, playerData.cardValues);
  console.log(playerCards);
  // Table based decision making section

  softOrHard();

  console.log("Hard table: ", playerData.hardTable);

  while (playerData.turnOver === false) {
    hardOrSoft(shuffledDeck);
    softOrHard();
    playerTotal.textContent = playerData.totalScore;
  }

  if (playerData.totalScore > 21) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    stopGame();
    return;
  }

  while (dealerData.turnOver === false)  {
    checkSoftHand();
    dealerAI(shuffledDeck);
    dealerTotal.textContent = dealerData.totalScore;
  } 

  if (dealerData.totalScore > 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    stopGame();
    return;
  }

  if (dealerData.totalScore >= playerData.totalScore) {
    dealerData.wins++;
    dealerScore.textContent = dealerData.wins;
    stopGame();
    return;
  }

  if (playerData.totalScore > dealerData.totalScore) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
    stopGame();
    return;
  }
}

function stopGame() {
  return;
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

function displayCard(card, nextCardPosition, nodeList) {
  currentCard = nodeList[nextCardPosition];
  cardAssets = currentCard.childNodes;
  cardAssets[1].textContent = `${card}`;
  cardAssets[3].textContent = "security";
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

  playerTotal.textContent = "0";
  dealerTotal.textContent = "0";

  playerData.aceSwitch = false;
  playerData.cardValues = [];
  playerData.numberOfCards = 0;
  playerData.over21 = false;
  playerData.hardTable = false;
  playerData.totalScore = 0;
  playerData.turnOver = false;

  dealerData.aceSwitch = false;
  dealerData.cardValues = [];
  dealerData.faceCard =  0;
  dealerData.softHand = false;
  dealerData.numberOfCards = 0;
  dealerData.over21 = false;
  dealerData.totalScore = 0;
  dealerData.turnOver = false;
  
  cardClone = cards;
}

function resetCards(cards) {
  for (let element of cards) {
    let elementChildren = element.childNodes;
    elementChildren[1].textContent = "";
    elementChildren[3].textContent = "";
    elementChildren[5].textContent = "";
  }
}

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
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 12 && dealerData.faceCard >=1 && dealerData.faceCard <= 3 && dealerData.faceCard >= 7) {
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 12 && dealerData.faceCard >=4 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards >= 3) {
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      stand(playerData);
    }
  } else if (playerData.totalScore === 13 && dealerData.faceCard >=2 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards >= 3) {
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      stand(playerData);
    }
  } else if (playerData.totalScore === 13 && (dealerData.faceCard >=7 || dealerData.faceCard === 1)) {
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 14 && dealerData.faceCard >=2 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards === 4) {
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      stand(playerData);
    }
  } else if (playerData.totalScore === 14 && (dealerData.faceCard >=7 && dealerData.faceCard === 1)) {
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 15 && dealerData.faceCard >=2 && dealerData.faceCard <= 6) {
    if (playerData.numberOfCards === 4) {
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      stand(playerData);
    }
  } else if (playerData.totalScore === 15 && (dealerData.faceCard >= 7 || dealerData.faceCard === 1)) {
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  } else if (playerData.totalScore === 16 && dealerData.faceCard >= 2 && dealerData.faceCard <= 3) {
    if (playerData.numberOfCards === 4) {
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      stand(playerData);
    }
  } else if (playerData.totalScore === 16 && dealerData.faceCard >= 4 && dealerData.faceCard <= 6) {
    stand(playerData);
  } else if (playerData.totalScore === 17 && dealerData.faceCard >= 2 && dealerData.faceCard <= 8) {
    stand(playerData);
  } else if (playerData.totalScore === 17 && (dealerData.faceCard >= 9 && dealerData.faceCard === 1)) {
    if (playerData.numberOfCards === 4) {
      hit(playerData, playerTotal, playerCards, shuffledDeck);
    } else {
      stand(playerData);
    }
  } else {
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
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  // 2-away Charlie
  else if ((playerData.totalScore === 18 && playerData.numberOfCards === 3)) {
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  else if (playerData.totalScore === 19 && playerData.numberOfCards === 3 && dealerData.faceCard === 10) {
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  // 1-away Charlie
  else if ((playerData.totalScore >= 19 && playerData.totalScore <= 21) && playerData.numberOfCards === 4) {
    hit(playerData, playerTotal, playerCards, shuffledDeck);
  }
  else {
    console.log("stand");
    stand(playerData);
  }
}

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

function stand(player) {
  player.turnOver = true;
}

function softOrHard() {
  if ((playerData.cardValues.filter(value => value === 1)).length >= 1) {
    playerData.hardTable = false;
  } else {
    playerData.hardTable = true;
  }
}

function changeAce(player) {
  if (player.aceSwitch === false && player.totalScore <= 11) {
    player.aceSwitch = true;
    player.totalScore += 10;
  } 

  if (player.aceSwitch === true && player.totalScore > 21) {
    player.aceSwitch = false;
    player.totalScore -= 10;
  }
}

function dealerAI(shuffledDeck) {
  if (dealerData.totalScore >= 17 && dealerData.aceSwitch === false) {
    stand(dealerData);
  } else if (dealerData.totalScore === 17 && dealerData.aceSwitch === true) {
    hit(dealerData, dealerTotal, dealerCards, shuffledDeck);
  } else if (dealerData.totalScore <= 16) {
    hit(dealerData, dealerTotal, dealerCards, shuffledDeck);
  } else {
    console.log("What happened?");
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