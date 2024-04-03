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
    console.log(this);
    // givin uid to enemy
    this.id = id;
    // gen start parameters to enemy
    this.entityInfo = this.randomCoordinatesOnEmptyTile(
      this.game.map,
      1,
      this.tileType,
      this.game.maxX,
      this.game.maxY,
    )[0];
    // Also pushing info about map size for some reason
    this.entityInfo = {
      ...this.entityInfo,
      maxX: this.game.maxX,
      maxY: this.game.maxY,
      hp: this.hp,
      atc: this.atc,
      tileType: this.tileType,
      id: this.id,
    };

    // new actual coordinates
    this.coordinates = {
      x: this.entityInfo.tileX,
      y: this.entityInfo.tileY,
    };
    this.spawnEntity(this.entityInfo, this.game.entities);
  }
}
