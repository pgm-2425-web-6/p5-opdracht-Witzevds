let canvas;
let wheel;
let wheelAngle = 0;
let spinning = false;
let spinSpeed = 0;
let coins = 100; // Start met 100 munten
let bet = 10; // Standaard inzet
let targetAngle = 0; // Doelhoek voor het draaien
let segments = [
  { label: "Lose", multiplier: 0 },
  { label: "x1", multiplier: 1 },
  { label: "x2", multiplier: 2 },
  { label: "x3", multiplier: 3 },
];
let arrowHeight = 20;
let resultMessage = ""; // Bericht over de uitkomst
let messageTimer = 0; // Tijd om het bericht weer te geven

function setup() {
  canvas = createCanvas(400, 500);
  canvas.parent("canvas-container");
  angleMode(DEGREES);
  wheel = new Wheel(segments);
}

function draw() {
  background(30);

  translate(width / 2, height / 2 - 50);

  // Teken het wiel
  if (spinning) {
    wheelAngle += spinSpeed; // Draai het wiel
    spinSpeed *= 0.97; // Verminder de snelheid geleidelijk
    if (spinSpeed < 0.1) {
      spinSpeed = 0;
      spinning = false;
      determineResult(); // Bereken het resultaat nadat het wiel stopt
    }
  }

  rotate(wheelAngle);
  wheel.display();

  // Reset rotatie matrix voor statische elementen
  resetMatrix();

  // Teken de pijl
  drawArrow();

  // Toon munten en inzetinformatie
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(`Coins: ${coins}`, width / 2, height - 100);
  text(`Current Bet: ${bet}`, width / 2, height - 70);

  // Instructies
  if (!spinning) {
    textSize(14);
    fill(200);
    text("Click to Spin!", width / 2, height - 40);
  }

  // Toon resultaatbericht
  if (messageTimer > 0) {
    textSize(20);
    fill(255, 215, 0);
    text(resultMessage, width / 2, height - 140);
    messageTimer--;
  }
}

function drawArrow() {
  fill("yellow");
  noStroke();
  triangle(
    width / 2 - arrowHeight,
    height / 2 - 250,
    width / 2 + arrowHeight,
    height / 2 - 250,
    width / 2,
    height / 2 - 230
  );
}

function mousePressed() {
  if (!spinning && coins >= bet) {
    coins -= bet; // Trek de inzet af
    targetAngle = random(360); // Willekeurige stophoek
    spinSpeed = random(10, 20); // Willekeurige spinsnelheid
    spinning = true;
    resultMessage = ""; // Wis het vorige bericht
  }
}

class Wheel {
  constructor(segments) {
    this.segments = segments;
    this.anglePerSegment = 360 / segments.length;
  }

  display() {
    let lastAngle = 0;

    for (let segment of this.segments) {
      fill(segment.label === "Lose" ? "red" : "green");
      stroke(0);
      strokeWeight(2);
      arc(0, 0, 400, 400, lastAngle, lastAngle + this.anglePerSegment, PIE);

      // Tekst op elk segment
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      let midAngle = lastAngle + this.anglePerSegment / 2;
      let x = cos(midAngle) * 150;
      let y = sin(midAngle) * 150;
      text(segment.label, x, y);

      lastAngle += this.anglePerSegment;
    }
  }
}

function determineResult() {
  let normalizedAngle = (360 - (wheelAngle % 360)) % 360; // Normaliseer hoek naar 0-360
  let segmentIndex = floor(normalizedAngle / (360 / segments.length));

  // Schuif de index met 1 op
  segmentIndex = (segmentIndex + 1) % segments.length;

  let result = segments[segmentIndex];

  // Pas coins aan op basis van multiplier
  if (result.multiplier > 0) {
    let winnings = bet * result.multiplier;
    coins += winnings;
    resultMessage = `You won ${winnings} coins!`;
  } else {
    resultMessage = `You lost your bet of ${bet} coins.`;
  }

  messageTimer = 180; // Laat het bericht ongeveer 3 seconden zien
}
