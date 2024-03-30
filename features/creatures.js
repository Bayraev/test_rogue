import { Game } from '../index.js';
import { Functions } from './common.js';

class Entity extends Functions {
  constructor() {
    super();
    // name must be a uid of living entities
    this.name = null;
    this.tileType = null;
    this.hp = 10;
    this.atc = 1;
    this.coordinates = {
      x: 0,
      y: 0,
    };
  }

  spawnEntity(entityInfo, tileType) {
    let field = document.querySelector('.field');
    let charElem = document.createElement('div');

    // choose tyleType
    charElem.className = tileType;
    // UI position
    charElem.style = `left: ${entityInfo.tileX * 50}px; top: ${entityInfo.tileY * 50}px;`;
    // scroll to main char
    if (tileType == 'tileP') {
      this.autoScrollToEntity(field, entityInfo, entityInfo.maxX, entityInfo.maxY);
    }

    field.append(charElem);
  }
}

export class Character extends Entity {
  constructor(gameInstance) {
    super();
    this.game = gameInstance;
    this.entityInfo = null;

    this.name = 'Hero';
    this.tileType = 'tileP';
  }
  init() {
    this.entityInfo = this.randomCoordinatesOnEmptyTile(
      this.game.map,
      1,
      this.tileType,
      this.game.maxX,
      this.game.maxY,
    )[0];
    this.entityInfo = { ...this.entityInfo, maxX: this.game.maxX, maxY: this.game.maxY };

    this.coordinates = {
      x: this.entityInfo.tileX,
      y: this.entityInfo.tileY,
    };
    this.spawnEntity(this.entityInfo, this.tileType);

    const self = this;
    document.addEventListener('keydown', function (event) {
      // Check if the pressed key is 'W', 'A', 'S', or 'D'
      if (event.key === 'w' || event.key === 'W' || event.key === 'ц' || event.key === 'Ц') {
        console.log('Key W pressed');
        self.move('top');
        // Your action for 'W' key press goes here
      } else if (event.key === 'a' || event.key === 'A' || event.key === 'ф' || event.key === 'Ф') {
        console.log('Key A pressed');
        self.move('left');
        // Your action for 'A' key press goes here
      } else if (event.key === 's' || event.key === 'S' || event.key === 'ы' || event.key === 'Ы') {
        console.log('Key S pressed');
        self.move('bottom');
        // Your action for 'S' key press goes here
      } else if (event.key === 'd' || event.key === 'D' || event.key === 'в' || event.key === 'В') {
        console.log('Key D pressed');
        self.move('right');
        // Your action for 'D' key press goes here
      }
    });
  }

  move(direction) {
    if (direction == 'top') {
      const entityElem = document.querySelector('.tileP');
      this.coordinates.y--;
      entityElem.style = `left: ${this.coordinates.x * 50}px; top: ${this.coordinates.y * 50}px;`;
    }
    if (direction == 'bottom') {
      const entityElem = document.querySelector('.tileP');
      this.coordinates.y++;
      entityElem.style = `left: ${this.coordinates.x * 50}px; top: ${this.coordinates.y * 50}px;`;
    }
    if (direction == 'right') {
      const entityElem = document.querySelector('.tileP');
      this.coordinates.x++;
      entityElem.style = `left: ${this.coordinates.x * 50}px; top: ${this.coordinates.y * 50}px;`;
    }
    if (direction == 'left') {
      const entityElem = document.querySelector('.tileP');
      this.coordinates.x--;
      entityElem.style = `left: ${this.coordinates.x * 50}px; top: ${this.coordinates.y * 50}px;`;
    }

    const field = document.querySelector('.field');
    this.autoScrollToEntity(
      field,
      { ...this.entityInfo, tileX: this.coordinates.x, tileY: this.coordinates.y },
      this.entityInfo.maxX,
      this.entityInfo.maxY,
    );
  }
}
