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

    // hp Bar
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
    field.append(charElem);

    // also hp atc display in inventory
    if (tileType == 'tileP') {
      this.autoScrollToEntity(field, entityInfo, entityInfo.maxX, entityInfo.maxY);

      // player hp from inventory
      let hpInventoryElem = document.querySelector('.hpInventory');
      let parentInventoryDataHp = hpInventoryElem.parentNode;
      parentInventoryDataHp.removeChild(hpInventoryElem);

      let newHpInventoryElem = document.createElement('span');
      newHpInventoryElem.className = 'hpInventory';
      newHpInventoryElem.textContent = this.hp;
      parentInventoryDataHp.append(newHpInventoryElem);

      // player atc from inventory
      let atcInventoryElem = document.querySelector('.atcInventory');
      let parentInventoryDataAtc = atcInventoryElem.parentNode;
      parentInventoryDataAtc.removeChild(atcInventoryElem);

      let newAtcInventoryElem = document.createElement('span');
      newAtcInventoryElem.className = 'atcInventory';
      newAtcInventoryElem.textContent = this.atc;
      parentInventoryDataAtc.append(newAtcInventoryElem);
    }
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
    let field = document.querySelector('.field');

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

    let comparable = this.findObjFromArrByCoordinates(this.game.map, newX, newY);

    switch (comparable.tileType) {
      case 'tile':
        const entityElem = document.querySelector('.tileP');
        this.coordinates.x = newX;
        this.coordinates.y = newY;
        entityElem.style = `left: ${this.coordinates.x * 50}px; top: ${this.coordinates.y * 50}px;`;

        this.autoScrollToEntity(
          field,
          { ...this.entityInfo, tileX: this.coordinates.x, tileY: this.coordinates.y },
          this.entityInfo.maxX,
          this.entityInfo.maxY,
        );
        break;

      case 'tileHP':
        // old elem with HP
        const selectedHpElem = document.getElementById(`${comparable.tileType + comparable.index}`);
        const parentHp = selectedHpElem.parentNode;
        parentHp.removeChild(selectedHpElem);

        // change pre-render map (but dont call render, cuz it finds by id above and change)
        this.game.map[comparable.index].tileType = 'tile';

        // replace it with new tile
        let newTileHp = document.createElement('div');
        // choose type of tile
        newTileHp.className = 'tile';
        // giving it stuff like key
        newTileHp.id = 'tileHP' + comparable.index;
        // UI control of postition of map-tiles
        newTileHp.style = `left: ${comparable.tileX * 50}px; top: ${comparable.tileY * 50}px;`;

        field.append(newTileHp);

        this.interactInventory('add', comparable);
        break;

      case 'tileSW':
        // old elem with HP
        const selectedSwordElem = document.getElementById(
          `${comparable.tileType + comparable.index}`,
        );
        const parentSword = selectedSwordElem.parentNode;
        parentSword.removeChild(selectedSwordElem);

        // change pre-render map (but dont call render, cuz it finds by id above and change)
        this.game.map[comparable.index].tileType = 'tile';

        // replace it with new tile
        let newTileSword = document.createElement('div');
        // choose type of tile
        newTileSword.className = 'tile';
        // giving it stuff like key
        newTileSword.id = 'tileHP' + comparable.index;
        // UI control of postition of map-tiles
        newTileSword.style = `left: ${comparable.tileX * 50}px; top: ${comparable.tileY * 50}px;`;
        field.append(newTileSword);

        this.interactInventory('add', comparable);
        break;

      default:
        break;
    }
  }

  interactInventory(action, tile, elem) {
    // function for add and use stuff
    let inventoryElem = document.querySelector('.inventory');

    switch (action) {
      case 'add':
        // This stuff becomes elem soon (check comment about recursy right above..)
        let newStuff = document.createElement('img');
        newStuff.className = 'stuff';
        newStuff.id = `${tile.tileType}${tile.index}`;
        newStuff.src = tile.src;

        inventoryElem.append(newStuff);

        // (..) recursy with inventory iteraction
        newStuff.addEventListener('click', () => this.interactInventory('use', tile, newStuff));

        break;

      case 'use':
        // delete it from dom
        inventoryElem.removeChild(elem);

        if (tile.tileType == 'tileHP') {
          // change data in instance
          this.hp = this.hp + 5;
          // player hp from bar
          let charElem = document.querySelector('.tileP');
          let hpBarElem = charElem.childNodes[0];
          charElem.removeChild(hpBarElem);

          let newHpBarElem = document.createElement('span');
          newHpBarElem.textContent = this.hp;
          newHpBarElem.className = 'health';
          charElem.prepend(newHpBarElem);

          // player hp from inventory
          let hpInventoryElem = document.querySelector('.hpInventory');
          let parentInventoryData = hpInventoryElem.parentNode;
          parentInventoryData.removeChild(hpInventoryElem);

          let newHpInventoryElem = document.createElement('span');
          newHpInventoryElem.className = 'hpInventory';
          newHpInventoryElem.textContent = this.hp;
          parentInventoryData.append(newHpInventoryElem);
        }
        if (tile.tileType == 'tileSW') {
          // change data in instance
          this.atc = this.atc + 2;

          // player atc from inventory
          let atcInventoryElem = document.querySelector('.atcInventory');
          let parentInventoryData = atcInventoryElem.parentNode;
          parentInventoryData.removeChild(atcInventoryElem);

          let newAtcInventoryElem = document.createElement('span');
          newAtcInventoryElem.className = 'atcInventory';
          newAtcInventoryElem.textContent = this.atc;
          parentInventoryData.append(newAtcInventoryElem);
        }

        break;

      default:
        break;
    }
  }
}
