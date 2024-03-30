import { Game } from '../index.js';

class Entity extends Game {
  constructor() {
    super();
    this.hp = 10;
    this.atc = 1;
    this.coordinates = {
      x: 0,
      y: 0,
    };
  }

  spawnEntity(entity, tileType) {
    let field = document.querySelector('.field');
    let charElem = document.createElement('div');

    // choose tyleType
    charElem.className = tileType;
    // UI position
    charElem.style = `left: ${entity.tileX * 50}px; top: ${entity.tileY * 50}px;`;
    // scroll to main char
    if (tileType == 'tileP') {
      this.autoScrollToEntity(field, entity, this.maxX, this.maxY);
    }

    field.append(charElem);
  }
}

export class Character extends Entity {
  constructor(gameInstance) {
    super();
    this.game = gameInstance;

    this.character = null;
  }
  init() {
    console.log(this.game.map);

    this.character = this.randomCoordinatesOnEmptyTile(
      this.game.map,
      1,
      'tileP',
      this.maxX,
      this.maxY,
    )[0];

    this.spawnEntity(this.character, 'tileP');
  }
}
