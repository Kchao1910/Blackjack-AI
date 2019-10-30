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
  wins: 0
};

let dealerData = {
  cardValues: [],
  numberOfCards: 0,
  over21: false,
  totalScore: 0,
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

