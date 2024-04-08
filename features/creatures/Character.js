import { heroMechanics } from '../mechanics/mechanics.js';
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
    // define entityInfo then spawn entity (also in game.entities map)
    const spawnData = {
      game: this.game,
      hero: this,
      entityInfo: this.entityInfo,
    };
    heroMechanics.heroEntityInfoAndSpawn(spawnData);
    // keyboard
    heroMechanics.heroInitKeyboard(this);
  }

  move(direction) {
    let field = document.querySelector('.field');

    // defining new coordinate
    let newX = this.coordinates.x;
    let newY = this.coordinates.y;
    // describe new coordinates according direction
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

    const data = {
      field,
      newX,
      newY,
      newCooordinatesMap,
      newCooordinatesEntities,
      game: this.game,
      hero: this,
    };

    if (newCooordinatesEntities.index == -1) {
      heroMechanics.heroMove(data);
    }
  }

  interactInventory(action, tile, elem) {
    // function for add and use stuff
    let inventoryElem = document.querySelector('.inventory');
    switch (action) {
      case 'add':
        const addData = {
          inventoryElem,
          tile,
          hero: this,
          game: this.game,
        };
        heroMechanics.heroAddToInventory(addData);
        break;

      case 'use':
        // delete it from dom inventory
        inventoryElem.removeChild(elem);
        const useData = {
          tile,
          game: this.game,
          hero: this,
        };
        heroMechanics.heroUseFromInventory(useData);
        break;

      default:
        break;
    }
  }

  attack() {
    let enemiesAround = this.entityAround(this.game.entities, this.coordinates);
    // prepare data to change and use
    const data = {
      enemiesAround,
      game: this.game,
      hero: this,
    };
    // calling service of attack
    heroMechanics.heroAttack(data);
  }
}
