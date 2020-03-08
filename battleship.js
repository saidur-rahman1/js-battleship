var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }
  ],
  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      /* indexOf looks for the value that is passed to it (guess)
      inside the object (index) and returns the index number of where
      the value starts */
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("Hit");
        if (this.isSunk(ship)) {
          this.shipsSunk++;
          view.displayMessage(this.shipsSunk + " ship(s) sunk!");
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Miss");
    return false;
  },
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") return false;
    }
    return true;
  },
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      // horizantal position
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      // vertical position
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // horizontal ship
        newShipLocations.push(row + "" + (col + i));
      } else {
        // vertical ship
        newShipLocations.push(row + i + "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) return true;
      }
    }
    return false;
  }
};

var controller = {
  guesses: 0,

  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          "All battleships sank in " + this.guesses + " guesses"
        );
        document.getElementById("guessInput").disabled = true;
        document.getElementById("fireButton").disabled = true;
      }
    }
  }
};

function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("Invalid entry. Entry should be like - A0");
  } else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Error! Value not on board");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Error! Value off board");
    } else {
      return row + column;
    }
  }
  return null;
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value.toUpperCase();
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    /* If you press the RETURN key, the event's keyCode property 
    will be set to 13. If that's the case, then we want to cause 
    the Fire! button to act like it was clicked. We can do that by 
    calling the fireButton's click method (basically tricking it 
    into thinking it was clicked). */
    fireButton.click();
    return false;
    /* And we return false so the form doesn't do anything else
    (like try to submit itself) */
  }
}

window.onload = init;

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}
