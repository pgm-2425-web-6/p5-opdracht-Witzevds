let price = 1; // Startprijs
let t = 0; // Tijd voor de noise
let isActive = true; // Of het spel actief is
let coins = 100; // Startaantal munten
let bet = 0; // Aantal munten ingezet
let buyPrice = 1; // De prijs waarop de speler heeft gekocht
let gameOver = false; // Of het spel is afgelopen
let priceHistory = []; // Opslag van prijsgegevens voor de grafiek
let selling = false; // Of er een verkoop bezig is
let sellCountdown = 0; // Afteller voor verkoop
let sellTimeout = 5; // 5 seconden om te verkopen
let sellStartTime = 0; // Starttijd van verkoop
let hasPowerUp = false; // Of de speler een power-up heeft

let targetCoins = 200; // Doel om 200 munten te behalen
let lastPrice = 1; // Vorige prijs voor crash kans
let crashChance = 0.0005; // 0.5% kans op crash (veel lager dan voorheen)

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(24);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  sellStartTime = millis(); // Begin van verkoopperiode
}

function draw() {
  background(0);

  if (isActive) {
    // Prijsberekening met volatiele noise en crashkans
    price = noise(t) * 70;
    t += 0.02;

    // Simuleer een crash (kans 0.5%)
    if (random() < crashChance) {
      price = random(0, 10); // Drastische prijsdaling
      text("CRASH! Verlies mogelijk!", width / 2, height / 2);
    }

    // Verkoop automatisch als tijd is verstreken
    if (selling && millis() - sellStartTime > sellTimeout * 1000) {
      finishSell();
    }

    // Prijsfluctuaties weergeven in de grafiek
    if (priceHistory.length > width) {
      priceHistory.shift(); // Verwijder oudste prijs als de grafiek vol is
    }
    priceHistory.push(price);

    // Teken de prijsgrafiek over het volledige scherm
    stroke(255, 0, 0); // Rode lijn
    noFill();
    beginShape();
    for (let x = 0; x < priceHistory.length; x++) {
      let y = map(priceHistory[x], 0, 100, height, 0); // Schaal naar hoogte
      vertex(x, y);
    }
    endShape();

    // Toon tekstinformatie
    fill(255);
    text(`Prijs: ${price.toFixed(2)} munten`, width / 2, 40);
    text(`Ingezet: ${bet.toFixed(2)} munten`, width / 2, 80);
    text(`Coins: ${coins.toFixed(2)}`, width / 2, 120);

    // Toon de prijs waarop de speler heeft gekocht
    if (bet > 0) {
      text(`Koopprijs: ${buyPrice.toFixed(2)} munten`, width / 2, 160);
    }

    // Waarde bij verkoop
    if (bet > 0 && !selling) {
      let estimatedValue = bet * price;
      text(
        `Waarde als je verkoopt: ${estimatedValue.toFixed(2)} munten`,
        width / 2,
        200
      );
    }

    // Afteller voor verkoop
    if (selling) {
      let timeLeft = sellTimeout - floor((millis() - sellStartTime) / 1000);
      fill(255, 255, 0);
      textSize(32);
      text(`Verkoop in: ${timeLeft}`, width / 2, height / 2 - 100);
      textSize(24);
    }

    // Knoppen weergeven
    drawButtons();
  } else {
    // Game Over-scherm
    fill(255, 0, 0);
    textSize(32);
    text("Game Over!", width / 2, height / 3);
    textSize(24);
    text(`Eindbalans: ${coins.toFixed(2)}`, width / 2, height / 3 + 40);
  }
}

function drawButtons() {
  // Inzetten knop
  if (bet === 0 && !selling) {
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 60 &&
      mouseY < height / 2 - 20
    ) {
      fill(0, 255, 0);
    } else {
      fill(100, 255, 100);
    }
    rect(width / 2 - 100, height / 2 - 60, 200, 40, 10);
    fill(0);
    text("Inzetten", width / 2, height / 2 - 40);
  }

  // Verkoop knop
  if (bet > 0 && !selling) {
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 20 &&
      mouseY < height / 2 + 60
    ) {
      fill(255, 0, 0);
    } else {
      fill(255, 100, 100);
    }
    rect(width / 2 - 100, height / 2 + 20, 200, 40, 10);
    fill(0);
    text("Verkoop", width / 2, height / 2 + 40);
  }
}

function mousePressed() {
  if (gameOver) {
    resetGame(); // Reset het spel als het afgelopen is
  } else {
    // Inzetten
    if (
      bet === 0 &&
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 60 &&
      mouseY < height / 2 - 20
    ) {
      if (coins >= 10) {
        bet = 10;
        coins -= bet;
        buyPrice = price;
        isActive = true;
      }
    }

    // Verkoop
    if (
      bet > 0 &&
      !selling &&
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 20 &&
      mouseY < height / 2 + 60
    ) {
      startSellCountdown();
    }
  }
}

function startSellCountdown() {
  selling = true;
  sellStartTime = millis(); // Start de verkoop-timer
}

function finishSell() {
  let estimatedValue = bet * price;
  let profitOrLoss = estimatedValue - bet * buyPrice;

  // Bereken de winst of verlies
  if (profitOrLoss < 0) {
    // Verlies van coins bij verlies
    coins += profitOrLoss; // Verlies wordt van coins afgetrokken
  } else {
    coins += profitOrLoss; // Winst wordt toegevoegd aan coins
  }

  bet = 0;
  selling = false;

  // Power-up kans na verkoop
  if (random() < 0.1) {
    // 10% kans op power-up na verkoop
    activatePowerUp();
  }
}

function activatePowerUp() {
  hasPowerUp = true;
  setTimeout(() => {
    hasPowerUp = false;
  }, 5000); // Power-up activeer voor 5 seconden
  console.log("Power-up geactiveerd!");
}

function resetGame() {
  if (coins > 0) {
    bet = 0;
    buyPrice = 1;
    isActive = true;
    gameOver = false;
    t = 0;
    price = 1;
    priceHistory = [];
    selling = false;
    sellCountdown = 0;
    crashChance = 0.0005; // Reset crash kans
  } else {
    gameOver = true;
  }
}
