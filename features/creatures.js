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
    let hpBarElem = document.createElement('span');

    hpBarElem.textContent = 10;
    hpBarElem.className = 'health';
    charElem.prepend(hpBarElem);
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
        self.move('top');
        // Your action for 'W' key press goes here
      } else if (event.key === 'a' || event.key === 'A' || event.key === 'ф' || event.key === 'Ф') {
        self.move('left');
        // Your action for 'A' key press goes here
      } else if (event.key === 's' || event.key === 'S' || event.key === 'ы' || event.key === 'Ы') {
        self.move('bottom');
        // Your action for 'S' key press goes here
      } else if (event.key === 'd' || event.key === 'D' || event.key === 'в' || event.key === 'В') {
        self.move('right');
        // Your action for 'D' key press goes here
      }
    });
  }

  move(direction) {
    let newX = this.coordinates.x;
    let newY = this.coordinates.y;

    switch (direction) {
      case 'top':
        newY--;
        break;
      case 'bottom':
        newY++;
        break;
      case 'right':
        newX++;
        break;
      case 'left':
        newX--;
        break;
      default:
        return; // Invalid direction
    }

    const comparable = this.findObjFromArrByCoordinates(this.game.map, newX, newY);

    switch (comparable.tileType) {
      case 'tile':
        const entityElem = document.querySelector('.tileP');
        this.coordinates.x = newX;
        this.coordinates.y = newY;
        entityElem.style = `left: ${this.coordinates.x * 50}px; top: ${this.coordinates.y * 50}px;`;

        const field = document.querySelector('.field');
        this.autoScrollToEntity(
          field,
          { ...this.entityInfo, tileX: this.coordinates.x, tileY: this.coordinates.y },
          this.entityInfo.maxX,
          this.entityInfo.maxY,
        );
        break;

      case 'tileHP':
        this.game.map[comparable.index].tileType = 'tile';
        break;

      default:
        break;
    }
  }
}
