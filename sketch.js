let price = 1; // Startprijs
let t = 0; // Tijd voor de noise
let isActive = true; // Of het spel actief is
let coins = 100; // Startaantal munten
let bet = 0; // Aantal munten ingezet
let buyPrice = 1; // De prijs waarop de speler heeft gekocht
let gameOver = false; // Of het spel is afgelopen

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(24);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
}

function draw() {
  background(0);

  // Als het spel niet is afgelopen, bereken de prijs en laat de game zien
  if (isActive) {
    // Simuleer de prijs met Perlin noise (dit bepaalt de fluctuatie van de prijs)
    price = noise(t) * 10; // Perlin noise tussen 0 en 100
    t += 0.01; // Beweeg door de tijd

    // Teken de prijs als een fluctuatie lijn
    stroke(255, 0, 0); // Rood voor de lijn
    noFill();
    beginShape();
    for (let x = 0; x < width; x++) {
      let y = noise(t + x * 0.05) * 100 + height / 2; // Noise fluctuatielijn
      vertex(x, y);
    }
    endShape();

    // Teken de huidige prijs als een tekst boven de lijn
    fill(255);
    text(`Prijs: ${price.toFixed(2)} munten`, width / 2, height / 3);

    // Teken de inzet en munten
    text(`Ingezet: ${bet} munten`, width / 2, height / 3 + 40);
    text(`Coins: ${coins}`, width / 2, height / 3 + 80);

    // Toon de geschatte waarde als je zou verkopen
    if (bet > 0) {
      let estimatedValue = bet * price; // Huidige waarde van de inzet
      text(
        `Waarde als je verkoopt: ${estimatedValue.toFixed(2)} munten`,
        width / 2,
        height / 3 + 120
      );
    }

    // Knop voor verkopen
    if (
      bet > 0 &&
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 60 &&
      mouseY < height / 2 + 100
    ) {
      fill(255, 0, 0);
      rect(width / 2 - 100, height / 2 + 60, 200, 40);
      fill(0);
      text("Verkoop", width / 2, height / 2 + 80);
    } else {
      fill(0, 255, 0);
      rect(width / 2 - 100, height / 2, 200, 40);
      fill(0);
      text("Inzetten", width / 2, height / 2 + 20);
    }
  } else {
    // Als het spel over is, geef dan de eindstand weer
    fill(255, 0, 0);
    textSize(32);
    text("Game Over!", width / 2, height / 3);
    textSize(24);
    text(`Eindbalans: ${coins}`, width / 2, height / 3 + 40);
  }
}

function mousePressed() {
  if (gameOver) {
    resetGame(); // Reset het spel als het afgelopen is
  } else {
    // Als de gebruiker op de inzetknop klikt
    if (
      bet === 0 &&
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 20 &&
      mouseY < height / 2 + 20
    ) {
      if (coins >= 10) {
        // Minimum inzet
        bet = 10; // Zet 10 munten in
        coins -= bet;
        buyPrice = price; // Sla de prijs op waarop de speler kocht
        isActive = true;
      }
    }

    // Als de gebruiker op de verkoopknop klikt
    if (
      bet > 0 &&
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 60 &&
      mouseY < height / 2 + 100
    ) {
      sellBet(); // Verkoop de inzet
    }
  }
}

// Verkoop de inzet en bereken de winst of verlies
function sellBet() {
  let estimatedValue = bet * price; // Huidige waarde bij verkoop
  let profitOrLoss = estimatedValue - bet * buyPrice; // Winst of verlies
  coins += profitOrLoss; // Voeg winst of verlies toe aan munten
  bet = 0; // Reset de inzet
  isActive = true; // Zet het spel weer actief
  // Game gaat verder, geen game over status
}

// Reset de game
function resetGame() {
  if (coins > 0) {
    // Reset het spel alleen als de speler nog munten heeft
    bet = 0; // Reset inzet
    buyPrice = 1; // Reset de koopprijs
    isActive = true; // Start een nieuw spel
    gameOver = false; // Zet game over uit
    t = 0; // Reset de tijd voor de noise
    price = 1; // Zet de prijs terug naar 1
  } else {
    // Als de speler geen munten meer heeft, dan is het echt game over
    gameOver = true;
  }
}
