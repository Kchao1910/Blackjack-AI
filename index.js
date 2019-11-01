(function() {
  document.querySelector("#play-button").addEventListener("click", function() {
    game();
  });
})();

let playerData = {
  cardValues: [],
  numberOfCards: 0,
  over21: false,
  totalScore: 0,
  turnOver: false,
  wins: 0
};

let dealerData = {
  cardValues: [],
  faceCard: 0,
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

function game() {
  let shuffledDeck = fisherYatesShuffle(cards);
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
  }

  if (playerData.totalScore === 21 && dealerData.totalScore < 21) {
    playerData.wins++;
    playerScore.textContent = playerData.wins;
  }

  console.log(dealerData.cardValues, playerData.cardValues);

  // Table based decision making section
  while (playerData.turnOver !== true) {
    playerTurn2(shuffledDeck);
  }


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


// hard table
function playerTurn2(shuffledDeck) {
  // base case
  if (playerData.numberOfCards === 5) {
    return;
  }

  if (playerData.totalScore >= 5 && playerData.totalScore <= 11)
}

// soft table
function softTable(shuffledDeck) {
  // base case
  if (playerData.numberOfCards === 5) {
    return;
  }

  if (playerData.totalScore <= 15) {
    hit(shuffledDeck);
  } else if (playerData.totalScore === 16 && dealerData.faceCard >= 2 && dealerData.faceCard <= 3) {
    hit(shuffledDeck);
  } else if (playerData.totalScore === 16 && dealerData.faceCard >= 4 && dealerData.faceCard <= 6) {
    stand(playerData);
  } else if (playerData.totalScore === 16 && (dealerData.faceCard >= 7 || dealerData.faceCard === 1)) {
    hit(shuffledDeck);
  } else if (playerData.totalScore === 17 && dealerData.faceCard >= 2 && dealerData.faceCard <= 8) {
    stand(playerData);
  } else if (playerData.totalScore === 17 && (dealerData.faceCard >= 9 || dealerData.faceCard === 1)) {
    hit(shuffledDeck);
  } else if (playerData.totalScore >= 18) {
    stand(playerData);
  } else {
    console.log("unchecked error");
    return;
  }
}


function hit(shuffledDeck) {
  let card = getCard(shuffledDeck);
  let nextCardPosition = getCardPlacement(playerData);

  displayCard(card, nextCardPosition, playerCards);

  playerData.cardValues.push(card);
  playerData.numberOfCards++;
  playerData.totalScore += card;

  playerTotal.textContent = playerData.totalScore;

  if (playerData.totalScore >= 21) {
    playerData.turnOver = true;
  }
}

function stand(player) {
  player.turnOver = true;
}