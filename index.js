class Game {
  constructor() {
    this._map = [];
    this._structures = [];
    // here you can control size of map
    this.maxY = 24;
    this.maxX = 40;
  }

  init() {
    this.generateTerrain(); // creating terrain
    this.generateStructure(); // generating structures
  }

  generateTerrain() {
    for (let y_index = 0; y_index <= this.maxY; y_index++) {
      for (let x_index = 0; x_index <= this.maxX; x_index++) {
        this._map.push({ tileY: y_index, tileX: x_index });
      }
    }

    this.renderMap();
  }

  renderMap() {
    let field = document.querySelector('.field');

    this._map.forEach((tile) => {
      let newTile = document.createElement('div');
      newTile.className = 'tile';
      // UI control of postition of map-tiles
      newTile.style = `left: ${tile.tileX * 50}px; top: ${tile.tileY * 50}px;`;
      //   identificator delete
      newTile.textContent = `${tile.tileY} / ${tile.tileX}`;

      field.append(newTile);
    });
  }
}
