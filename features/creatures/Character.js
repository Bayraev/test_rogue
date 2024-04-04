import { Entity } from './creatures.js';

export default class Character extends Entity {
  constructor(gameInstance) {
    super();
    this.game = gameInstance;
    this.entityInfo = null;

    this.name = 'Hero';
    this.tileType = 'tileP';
    this.id = 'tileP';
  }
  init() {
    // Information for spawn and for entity arr
    this.entityInfo = this.randomCoordinatesOnEmptyTile(
      this.game.map,
      1,
      this.tileType,
      this.game.maxX,
      this.game.maxY,
    )[0];
    this.entityInfo = {
      ...this.entityInfo,
      maxX: this.game.maxX,
      maxY: this.game.maxY,
      hp: this.hp,
      atc: this.atc,
      tileType: this.tileType,
      id: this.id,
    };

    this.coordinates = {
      x: this.entityInfo.tileX,
      y: this.entityInfo.tileY,
    };
    // spawn
    this.spawnEntity(this.entityInfo, this.game.entities);

    // keyboard
    const self = this;
    const handleKeyboard = (event) => {
      // Check if the pressed key is 'W', 'A', 'S', or 'D'
      if (event.key === 'w' || event.key === 'W' || event.key === 'ц' || event.key === 'Ц') {
        self.move('top');
      } else if (event.key === 'a' || event.key === 'A' || event.key === 'ф' || event.key === 'Ф') {
        self.move('left');
      } else if (event.key === 's' || event.key === 'S' || event.key === 'ы' || event.key === 'Ы') {
        self.move('bottom');
      } else if (event.key === 'd' || event.key === 'D' || event.key === 'в' || event.key === 'В') {
        self.move('right');
      } else if (event.key === 'j' || event.key === 'J' || event.key === 'о' || event.key === 'О') {
        self.attack();
      }
    };
    document.addEventListener('keydown', (event) => handleKeyboard(event));
  }

  move(direction) {
    let field = document.querySelector('.field');

    // defining new coordinate
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

    // one to compare with map and stuff, second for checking entities
    let newCooordinatesMap = this.findObjFromArrByCoordinates(this.game.map, newX, newY);
    let newCooordinatesEntities = this.findObjFromArrByCoordinates(this.game.entities, newX, newY);

    if (newCooordinatesEntities.index == -1) {
      switch (newCooordinatesMap.tileType) {
        case 'tile':
          const entityElem = document.querySelector('.tileP');
          this.coordinates.x = newX;
          this.coordinates.y = newY;

          // change info in entities arr for hero
          const hero = this.findObjFromArrById(this.game.entities, 'tileP');
          this.game.entities[hero.index] = {
            ...hero,
            tileX: this.coordinates.x,
            tileY: this.coordinates.y,
          };

          entityElem.style = `left: ${this.coordinates.x * 50}px; top: ${
            this.coordinates.y * 50
          }px;`;

          this.autoScrollToEntity(
            field,
            { ...this.entityInfo, tileX: this.coordinates.x, tileY: this.coordinates.y },
            this.entityInfo.maxX,
            this.entityInfo.maxY,
          );
          break;

        case 'tileHP':
          // old elem with HP
          const selectedHpElem = document.getElementById(
            `${newCooordinatesMap.tileType + newCooordinatesMap.index}`,
          );
          const parentHp = selectedHpElem.parentNode;
          parentHp.removeChild(selectedHpElem);

          // change pre-render map (but dont call render, cuz it finds by id above and change)
          this.game.map[newCooordinatesMap.index].tileType = 'tile';

          // replace it with new tile
          let newTileHp = document.createElement('div');
          // choose type of tile
          newTileHp.className = 'tile';
          // giving it stuff like key
          newTileHp.id = 'tileHP' + newCooordinatesMap.index;
          // UI control of postition of map-tiles
          newTileHp.style = `left: ${newCooordinatesMap.tileX * 50}px; top: ${
            newCooordinatesMap.tileY * 50
          }px;`;

          field.append(newTileHp);

          this.interactInventory('add', newCooordinatesMap);
          break;

        case 'tileSW':
          // old elem with HP
          const selectedSwordElem = document.getElementById(
            `${newCooordinatesMap.tileType + newCooordinatesMap.index}`,
          );
          const parentSword = selectedSwordElem.parentNode;
          parentSword.removeChild(selectedSwordElem);

          // change pre-render map (but dont call render, cuz it finds by id above and change)
          this.game.map[newCooordinatesMap.index].tileType = 'tile';

          // replace it with new tile
          let newTileSword = document.createElement('div');
          // choose type of tile
          newTileSword.className = 'tile';
          // giving it stuff like key
          newTileSword.id = 'tileHP' + newCooordinatesMap.index;
          // UI control of postition of map-tiles
          newTileSword.style = `left: ${newCooordinatesMap.tileX * 50}px; top: ${
            newCooordinatesMap.tileY * 50
          }px;`;
          field.append(newTileSword);

          this.interactInventory('add', newCooordinatesMap);
          break;

        default:
          break;
      }
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

  attack() {
    let enemiesAround = this.entityAround(this.game.entities, this.coordinates);

    enemiesAround.forEach((enemy) => {
      if (enemy.index !== -1) {
        // damage according hero atc
        this.game.entities[enemy.index].hp = enemy.hp - this.atc;
        const actualEnemy = this.game.entities[enemy.index];
        // rerender enemy
        let entityElem = document.getElementById(`${enemy.tileType + enemy.id}`);
        let parentEntity = entityElem.parentNode;
        // upd hp
        let hpBarElem = entityElem.childNodes[0];
        entityElem.removeChild(hpBarElem);

        let newHpBarElem = document.createElement('span');
        newHpBarElem.textContent = actualEnemy.hp;
        newHpBarElem.className = 'health';
        entityElem.prepend(newHpBarElem);

        if (actualEnemy.hp <= 0) {
          parentEntity.removeChild(entityElem);
          const newEntites = this.deleteObjFromArrById(this.game.entities, enemy.id);
          this.game.entities = [...newEntites];
        }
      }
    });
  }
}
