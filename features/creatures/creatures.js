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

    // pushing entities in game.entities via link
    entityInfo.tileType == 'tileE' && GameEntitiesMap.push(entityInfo);
    entityInfo.tileType == 'tileP' && GameEntitiesMap.push(entityInfo);

    let field = document.querySelector('.field');

    // hp Bar
    let hpBarElem = this.createElem('span', 'health', null, entityInfo.hp);
    let charElem = this.createElem('div', entityInfo.tileType);
    // tileP have no id, but another entites have it
    entityInfo.tileType == 'tileP'
      ? (charElem.id = `${entityInfo.tileType}`)
      : (charElem.id = `${entityInfo.tileType + entityInfo.id}`);
    // UI position
    charElem.style = `left: ${entityInfo.tileX * 50}px; top: ${entityInfo.tileY * 50}px;`;
    charElem.prepend(hpBarElem);
    field.append(charElem);

    // also hp atc display in inventory
    if (entityInfo.tileType == 'tileP') {
      // scroll to main char
      this.autoScrollToEntity(field, entityInfo, entityInfo.maxX, entityInfo.maxY);

      // player hp from inventory
      let hpInventoryElem = document.querySelector('.hpInventory');
      let parentInventoryDataHp = hpInventoryElem.parentNode;
      parentInventoryDataHp.removeChild(hpInventoryElem);
      // new hp data from inventory
      let newHpInventoryElem = this.createElem('span', 'hpInventory', null, this.hp);
      parentInventoryDataHp.append(newHpInventoryElem);

      // player atc from inventory
      let atcInventoryElem = document.querySelector('.atcInventory');
      let parentInventoryDataAtc = atcInventoryElem.parentNode;
      parentInventoryDataAtc.removeChild(atcInventoryElem);
      // new atc data in inventory
      let newAtcInventoryElem = this.createElem('span', 'atcInventory', null, this.atc);
      parentInventoryDataAtc.append(newAtcInventoryElem);
    }
  }
}
