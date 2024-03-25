class BasicFunctions {
  getRandomNumber(countOfNumbers) {
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
}

class Game extends BasicFunctions {
  constructor() {
    super();
    this.map = [];
    this.structures = [];
    // here you can control size of map
    this.maxY = 24;
    this.maxX = 40;
  }

  init() {
    this.generateTerrain(); // creating terrain
  }

  generateTerrain() {
    for (let y_index = 0; y_index <= this.maxY; y_index++) {
      for (let x_index = 0; x_index <= this.maxX; x_index++) {
        this.map.push({ tileY: y_index, tileX: x_index, tileType: 'tile' });
      }
    }

    this.renderMap();
  }

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
    for (let structuresCount = 0; structuresCount < 10; structuresCount++) {
      // position according X-width
      let tileX = this.getRandomNumber(100);
      let tileY = this.getRandomNumber(100);
      let width = this.getRandomNumber(10);
      let height = this.getRandomNumber(10);

      // These do used to limit these parameters of structure
      do {
        tileX = this.getRandomNumber(100);
      } while (tileX < 0 || tileX > this.maxX);
      do {
        tileY = this.getRandomNumber(100);
      } while (tileY < 0 || tileY > this.maxY);

      do {
        width = this.getRandomNumber(10);
      } while (width < 3 || width > 8);

      do {
        height = this.getRandomNumber(10);
      } while (height < 3 || height > 8);

      this.structures.push({ tileX, tileY, width, height, tileType: 'tileW' });
    }

    this.map.forEach((mapTile, mapIndex) => {
      this.structures.forEach((structureTile) => {
        if (this.compareTiles(mapTile, structureTile)) {
          mapTile.tileType = structureTile.tileType;

          // Обновление объекта в массиве this.map
          for (let y_index = 0; y_index < structureTile.height; y_index++) {
            for (let x_index = 0; x_index < structureTile.width; x_index++) {
              const index = this.map.findIndex(
                (obj) =>
                  obj.tileX === mapTile.tileX + x_index && obj.tileY === mapTile.tileY + y_index,
              );
              if (index !== -1) {
                this.map[index].tileType = structureTile.tileType;
                // Дополнительная логика, если нужна
              }
            }
          }
        }
      });
    });

    this.renderMap();
  }
}
