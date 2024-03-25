class Functions {
  randomNumber(countOfNumbers) {
    return Math.floor(Math.random() * countOfNumbers);
  }
  compareTiles(mapTile, structureTile) {
    return mapTile.tileX === structureTile.tileX && mapTile.tileY === structureTile.tileY;
  }
  findObjFromArrByCoordinates(arr, x, y) {
    // you must remember coordinates are always must be like tileX and tileY keys
    const obj = arr.find((obj) => obj.tileX === x && obj.tileY === y);
    const index = arr.findIndex((obj) => obj.tileX === x && obj.tileY === y);
    return {
      ...obj,
      index,
    };
  }
  randomCoordinatesForRoads(xy, count) {
    // xy here is vector (x or y)
    console.log(count);
    let arr = [];
    for (let index = 0; index < count; index++) {
      let value;
      if (xy == 'x') {
        do {
          value = this.randomNumber(100);
        } while (value > this.maxX || arr.includes(value));
      }
      if (xy == 'y') {
        do {
          value = this.randomNumber(100);
        } while (value > this.maxY || arr.includes(value));
      }

      arr.push(value);
    }
    return arr;
  }
}

class Game extends Functions {
  constructor() {
    super();
    this.map = [];
    this.structures = [];
    this.roads = [];
    // here you can control size of map
    this.maxY = 24;
    this.maxX = 40;
  }
  init() {
    new ProceduralGeneration().generateTerrain();
  }
}

// order of functions exection
// generateTerrain => renderMap => generateStructures => renderMap
class ProceduralGeneration extends Game {
  constructor() {
    super();
    // control walls
    this.countOfWalls = 10 * 2;
    this.maxWidthOfWall = { min: 3, max: 10 };
    this.maxHeightOfWall = { min: 3, max: 10 };
    // control roads
    this.countOfHorizontalRoadsX = { min: 3, max: 8 };
    this.countOfVerticalRoadsY = { min: 3, max: 8 };
  }
  // creates obj-array for creating '
  generateTerrain() {
    for (let y_index = 0; y_index <= this.maxY; y_index++) {
      for (let x_index = 0; x_index <= this.maxX; x_index++) {
        this.map.push({ tileY: y_index, tileX: x_index, tileType: 'tile' });
      }
    }

    this.renderMap();
  }

  // rendering map, structures and stuff
  renderMap() {
    let field = document.querySelector('.field');
    field.innerHTML = '';

    this.map.forEach((tile) => {
      let newTile = document.createElement('div');
      // choose type of tile
      newTile.className = tile.tileType;
      // UI control of postition of map-tiles
      newTile.style = `left: ${tile.tileX * 50}px; top: ${tile.tileY * 50}px;`;

      field.append(newTile);
    });

    this.structures.length <= 0 && this.generateStructures(); // generating structures
  }

  generateStructures() {
    for (let structuresCount = 0; structuresCount < this.countOfWalls; structuresCount++) {
      // position according X-width
      let tileX = this.randomNumber(100);
      let tileY = this.randomNumber(100);
      let width = this.randomNumber(10);
      let height = this.randomNumber(10);

      // These 'do' used to limit these parameters of structure
      do {
        tileX = this.randomNumber(100);
      } while (tileX < 0 || tileX > this.maxX);
      do {
        tileY = this.randomNumber(100);
      } while (tileY < 0 || tileY > this.maxY);

      do {
        width = this.randomNumber(10);
      } while (width < this.maxWidthOfWall.min || width > this.maxWidthOfWall.max);

      do {
        height = this.randomNumber(10);
      } while (height < this.maxHeightOfWall.min || height > this.maxHeightOfWall.max);

      this.structures.push({ tileX, tileY, width, height, tileType: 'tileW' });
    }

    // mappin them for comparing
    this.map.forEach((mapTile) => {
      this.structures.forEach((structureTile) => {
        if (this.compareTiles(mapTile, structureTile)) {
          mapTile.tileType = structureTile.tileType;

          // comparing and then...
          for (let y_index = 0; y_index < structureTile.height; y_index++) {
            for (let x_index = 0; x_index < structureTile.width; x_index++) {
              // ...rendering
              // finding index of selected coordinate-obj according comparable data

              const selectedObjWithIndex = this.findObjFromArrByCoordinates(
                this.map,
                mapTile.tileX + x_index,
                mapTile.tileY + y_index,
              );

              // just changing every tile cuz we have indexex of all of them
              if (selectedObjWithIndex.index !== -1) {
                this.map[selectedObjWithIndex.index].tileType = structureTile.tileType;
              }
            }
          }
        }
      });
    });

    this.generateRoads();
    this.renderMap();
  }

  generateRoads() {
    let countOfHorizontalRoadsX; // chooses count in scope of max count, described in constructor
    let countOfVerticalRoadsY; // chooses count in scope of max count, described in constructor

    // chooses count in scope of max count, described in constructor for X
    do {
      countOfHorizontalRoadsX = this.randomNumber(10);
    } while (
      countOfHorizontalRoadsX > this.countOfVerticalRoadsY.max ||
      countOfHorizontalRoadsX < this.countOfVerticalRoadsY.min
    );

    // chooses count in scope of max count, described in constructor for Y
    do {
      countOfVerticalRoadsY = this.randomNumber(10);
    } while (
      countOfVerticalRoadsY > this.countOfVerticalRoadsY.max ||
      countOfVerticalRoadsY < this.countOfVerticalRoadsY.min
    );

    // here are arrays with only a numbers in array
    let tileX = this.randomCoordinatesForRoads('x', countOfHorizontalRoadsX);
    let tileY = this.randomCoordinatesForRoads('y', countOfVerticalRoadsY);

    // rendering vertical
    tileX.forEach((x_coordinate) => {
      for (let y_coordinate = 0; y_coordinate < this.maxY; y_coordinate++) {
        // so bcs we iterate XY, we get all coordinates thats corresponds our "request"
        let selectedObjWithIndex = this.findObjFromArrByCoordinates(
          this.map,
          x_coordinate,
          y_coordinate,
        );
        // and then we edit it using index of obj we must update
        if (selectedObjWithIndex.index !== -1) {
          this.map[selectedObjWithIndex.index].tileType = 'tile';
        }
      }
      // next code because it doest change tile of last Y coordinate  with some reason
      let selectedObjWithIndex = this.findObjFromArrByCoordinates(
        this.map,
        x_coordinate,
        this.maxY,
      );

      if (selectedObjWithIndex.index !== -1) {
        this.map[selectedObjWithIndex.index].tileType = 'tile';
      }
    });

    // rendering horizontal
    tileY.forEach((y_coordinate) => {
      for (let x_coordinate = 0; x_coordinate < this.maxX; x_coordinate++) {
        // so bcs we iterate XY, we get all coordinates thats corresponds our "request"
        let selectedObjWithIndex = this.findObjFromArrByCoordinates(
          this.map,
          x_coordinate,
          y_coordinate,
        );
        // and then we edit it using index of obj we must update
        if (selectedObjWithIndex.index !== -1) {
          this.map[selectedObjWithIndex.index].tileType = 'tile';
        }
      }
      // next code because it doest change tile of last Y coordinate  with some reason
      let selectedObjWithIndex = this.findObjFromArrByCoordinates(
        this.map,
        y_coordinate,
        this.maxX,
      );
      console.log(selectedObjWithIndex);
      if (selectedObjWithIndex.index !== -1) {
        this.map[selectedObjWithIndex.index].tileType = 'tile';
      }
    });
  }
}
