import { Functions } from './features/common.js';

export class Game extends Functions {
  constructor() {
    super();
    // units on the map
    this.mainHero = [];
    // world
    this.map = []; // map with coordinates, BUT also for-final-render stuff, it means it will contain structures, roads, stuff etc
    this.structures = [];
    // here you can control size of map
    this.maxY = 24;
    this.maxX = 40;
  }
  init(Character) {
    new ProceduralGeneration(this).generateTerrain();

    const char = new Character(this);
    char.init();
  }
}

// order of functions ezxection
// generateTerrain => renderMap => generateStructures => renderMap
class ProceduralGeneration extends Game {
  constructor(gameInstance) {
    super();
    this.game = gameInstance;
    // control walls
    this.countOfWalls = 10 * 2;
    this.maxWidthOfWall = { min: 3, max: 10 };
    this.maxHeightOfWall = { min: 3, max: 10 };
    // control roads
    this.countOfHorizontalRoadsX = { min: 3, max: 8 };
    this.countOfVerticalRoadsY = { min: 3, max: 8 };
    // control stuff
    this.countOfPoisons = 10;
    this.countOfSwords = 2;
  }

  // rendering map, structures and stuff
  renderMap() {
    let field = document.querySelector('.field');
    field.innerHTML = '';

    this.game.map.forEach((tile, index) => {
      let newTile = document.createElement('div');
      // choose type of tile
      newTile.className = tile.tileType;
      // giving it stuff like key
      newTile.id = tile.tileType + index;
      // UI control of postition of map-tiles
      newTile.style = `left: ${tile.tileX * 50}px; top: ${tile.tileY * 50}px;`;

      field.append(newTile);
    });

    this.game.structures.length <= 0 && this.generateStructures(); // generating structures
  }

  // creates obj-array for creating '
  generateTerrain() {
    for (let y_index = 0; y_index <= this.maxY; y_index++) {
      for (let x_index = 0; x_index <= this.maxX; x_index++) {
        this.game.map.push({
          tileY: y_index,
          tileX: x_index,
          tileType: 'tile',
          src: 'images/tile-.png',
        });
      }
    }

    this.generateStructures();
    this.generateRoads();
    this.generateStuff();
    this.renderMap();

    console.log(this.game.mainHero);
    console.log(this.game.map);
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

      this.game.structures.push({
        tileX,
        tileY,
        width,
        height,
        tileType: 'tileW',
        src: 'images/tile-W.png',
      });
    }

    // mappin them for comparing
    this.game.map.forEach((mapTile) => {
      this.game.structures.forEach((structureTile) => {
        if (this.compareTiles(mapTile, structureTile)) {
          mapTile.tileType = structureTile.tileType;

          // comparing and then...
          for (let y_index = 0; y_index < structureTile.height; y_index++) {
            for (let x_index = 0; x_index < structureTile.width; x_index++) {
              // ...rendering
              // finding index of selected coordinate-obj according comparable data

              const selectedObjWithIndex = this.findObjFromArrByCoordinates(
                this.game.map,
                mapTile.tileX + x_index,
                mapTile.tileY + y_index,
              );

              // just changing every tile cuz we have indexex of all of them
              if (selectedObjWithIndex.index !== -1) {
                this.game.map[selectedObjWithIndex.index].tileType = structureTile.tileType;
                this.game.map[selectedObjWithIndex.index].src = 'images/tile-W.png';
              }
            }
          }
        }
      });
    });
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
          this.game.map,
          x_coordinate,
          y_coordinate,
        );
        // and then we edit it using index of obj we must update
        if (selectedObjWithIndex.index !== -1) {
          this.game.map[selectedObjWithIndex.index].tileType = 'tile';
        }
      }
      // next code because it doest change tile of last Y coordinate  with some reason
      let selectedObjWithIndex = this.findObjFromArrByCoordinates(
        this.game.map,
        x_coordinate,
        this.maxY,
      );

      if (selectedObjWithIndex.index !== -1) {
        this.game.map[selectedObjWithIndex.index].tileType = 'tile';
      }
    });

    // rendering horizontal
    tileY.forEach((y_coordinate) => {
      for (let x_coordinate = 0; x_coordinate < this.maxX; x_coordinate++) {
        // so bcs we iterate XY, we get all coordinates thats corresponds our "request"
        let selectedObjWithIndex = this.findObjFromArrByCoordinates(
          this.game.map,
          x_coordinate,
          y_coordinate,
        );
        // and then we edit it using index of obj we must update
        if (selectedObjWithIndex.index !== -1) {
          this.game.map[selectedObjWithIndex.index].tileType = 'tile';
        }
      }
      // next code because it doest change tile of last Y coordinate  with some reason
      let selectedObjWithIndex = this.findObjFromArrByCoordinates(
        this.game.map,
        y_coordinate,
        this.maxX,
      );
      if (selectedObjWithIndex.index !== -1) {
        this.game.map[selectedObjWithIndex.index].tileType = 'tile';
      }
    });
  }

  generateStuff() {
    // these both returns coordinates, tileType and index of changeble obj in map!!!
    const poisonsArray = this.randomCoordinatesOnEmptyTile(
      this.game.map,
      this.countOfPoisons,
      'tileHP',
      this.maxX,
      this.maxY,
    );
    const swordsArray = this.randomCoordinatesOnEmptyTile(
      this.game.map,
      this.countOfSwords,
      'tileSW',
      this.maxX,
      this.maxY,
    );

    // edit pre-render map
    poisonsArray.map((poison) => {
      if (poison.index !== 1) {
        this.game.map[poison.index].tileType = poison.tileType;
        this.game.map[poison.index].src = 'images/tile-HP.png';
      }
    });
    swordsArray.map((sword) => {
      if (sword.index !== 1) {
        this.game.map[sword.index].tileType = sword.tileType;
        this.game.map[sword.index].src = 'images/tile-SW.png';
      }
    });
  }
}
