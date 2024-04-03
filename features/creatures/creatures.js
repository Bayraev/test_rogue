import { Game } from '../../index.js';
import { Functions } from '../common.js';

export class Entity extends Functions {
  constructor() {
    super();
    // name must be a uid of living entities
    this.hp = 10;
    this.atc = 1;
    this.coordinates = {
      x: 0,
      y: 0,
    };
  }

  spawnEntity(entityInfo, GameEntitiesMap) {
    // entityInfo - data for spawn like type, coordinates, type
    // GameEntitiesMap - array with entities (exc hero)
    if (entityInfo.tileType == 'tileE') {
      // pushing enimies in game.entities via link
      GameEntitiesMap.push(entityInfo);
    }
    let field = document.querySelector('.field');

    // hp Bar
    let charElem = document.createElement('div');
    let hpBarElem = document.createElement('span');

    hpBarElem.textContent = 10;
    hpBarElem.className = 'health';
    charElem.prepend(hpBarElem);
    // choose tyleType
    charElem.className = entityInfo.tileType;
    charElem.id = entityInfo.tileType + entityInfo.id;
    // UI position
    charElem.style = `left: ${entityInfo.tileX * 50}px; top: ${entityInfo.tileY * 50}px;`;
    // scroll to main char
    field.append(charElem);

    // also hp atc display in inventory
    if (entityInfo.tileType == 'tileP') {
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
