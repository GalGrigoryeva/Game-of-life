var columnCount;
var rowCount;

var cellsViews;
var cellsStates;
var tbl;

var intervalID;

const render = () => {
  for (var i = 0; i < cellsStates.length; i++) {
    var cellState = cellsStates[i];
    var cellView = cellsViews[i];

    if (cellState) {
      cellView.style.background = "#5A7244";
    } else {
      cellView.style.background = "#99B266";
    }
  }
}

const checkAutoTurn = () => {
  if (document.getElementById("autoStep").checked) {
    intervalID = setInterval( update, 200);
  } else {
    clearInterval(intervalID);
  }
}

const update = () => {
  var nextStepNewCellsStates = cellsStates.slice();

  for (var i = 0; i < rowCount; i++) {
    for (var j = 0; j < columnCount; j++) {
      var currentCell = cellsStates[getIndex(j, i)];
      var currentCellNeighbors = getNeighbors(j, i);
      var liveNeighborCount = 0;
      var currentCellFromNextState = nextStepNewCellsStates[getIndex(j, i)];

      for (var z = 0; z < currentCellNeighbors.length; z++) {
        if (currentCellNeighbors[z]) {
          liveNeighborCount++;
        }
      }

      if (!currentCell && liveNeighborCount == 3) {
        currentCellFromNextState = true;
      }
      if (currentCell && (liveNeighborCount > 3 || liveNeighborCount < 2)) {
        currentCellFromNextState = false;
      }

      nextStepNewCellsStates[getIndex(j, i)] = currentCellFromNextState;
    }
  }

  cellsStates = nextStepNewCellsStates.slice();

  render();
}

const getIndex = (cellX, cellY) => {
  cellX = cellX % columnCount;
  if (cellX < 0) {
    cellX = columnCount + cellX;
  }

  cellY = cellY % rowCount;
  if (cellY < 0) {
    cellY = rowCount + cellY;
  }

  var index = columnCount * cellY + cellX;
  return index;
}

const getNeighbors = (cellX, cellY) => {
  var neighbors = [];

  for (var y = (cellY - 1); y <= (cellY + 1); y++) {
    for (var x = (cellX - 1); x <= (cellX + 1); x++) {

      if (x === cellX && y === cellY) {
        continue;
      }

      neighbors.push(cellsStates[getIndex(x, y)]);
    }
  }
  return neighbors;
}

function cellOnClick() {
  var index = this.index;

  cellsStates[index] = !cellsStates[index];

  render();
}

const reset = () => {
  var body = document.getElementsByTagName("body");

  if (tbl) {
    body.removeChild(tbl);
  }

  columnCount = parseInt(document.getElementById("width").value);
  rowCount = parseInt(document.getElementById("height").value);

  cellsViews = [];
  cellsStates = [];

  tbl = document.createElement("table");
  var tblBody = document.createElement("tBody");

  for (var y = 0; y < rowCount; y++) {
    var row = document.createElement("tr");

    for (var x = 0; x < columnCount; x++) {
      var cellView = document.createElement("td");

      cellView.index = getIndex(x, y);

      cellView.onclick = cellOnClick;

      var cellState = false;

      row.appendChild(cellView);

      if (document.getElementById("isRandom").checked && Math.random() > 0.5) {
        cellState = true;
      }

      cellsViews.push(cellView);
      cellsStates.push(cellState);
    }

    tblBody.appendChild(row);
  }

  tbl.appendChild(tblBody);
  body.appendChild(tbl);

  render();
}
reset();
