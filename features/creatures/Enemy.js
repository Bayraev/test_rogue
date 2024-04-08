import { commonMechanics, enemyMechanics } from '../mechanics/mechanics.js';
import { Entity } from './creatures.js';

export default class Enemy extends Entity {
  constructor(gameInstance) {
    super();
    this.game = gameInstance;

    this.id = null; // num
    this.tileType = 'tileE';
    this.entityInfo = null;
  }
  init(id) {
    // givin uid to enemy
    this.id = id;
    // define entityInfo then spawn entity (also in game.entities map)
    const spawnData = {
      game: this.game,
      entity: this,
      entityInfo: this.entityInfo,
    };
    commonMechanics.entityInfoAndSpawn(spawnData);
    this.moveLogic(id);
  }

  moveLogic(id) {
    const data = {
      id,
      entity: this,
      game: this.game,
    };
    enemyMechanics.enemyRecursiveMoveLogic(data);
  }

  move(entity, distaceX, distanceY) {
    const data = {
      entity,
      distaceX,
      distanceY,
      game: this.game,
    };
    enemyMechanics.enemyMove(data);
  }

  attack(characterToBeat) {
    const data = {
      characterToBeat,
      game: this.game,
      enemy: this,
    };

    enemyMechanics.enemyAttack(data);
  }
}
