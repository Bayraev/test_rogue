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
    this.moveLogic(id);
  }

  moveLogic(id) {
    const recursy = () => {
      const enemyEntity = this.findObjFromArrById(this.game.entities, id);
      const hero = this.findObjFromArrById(this.game.entities, 'tileP');

      // calculate distances between hero and enemy
      let distaceX = hero.tileX - enemyEntity.tileX;
      let distanceY = hero.tileY - enemyEntity.tileY;

      // according absolutes of distace, execute .move()
      if (Math.abs(distaceX) > Math.abs(distanceY)) {
        if (distaceX > 0) {
          // X
          // npc going right way
          const comparableEntities = this.findObjFromArrByCoordinates(
            this.game.entities,
            enemyEntity.tileX + 1,
            enemyEntity.tileY,
          );
          const comparableMap = this.findObjFromArrByCoordinates(
            this.game.map,
            enemyEntity.tileX + 1,
            enemyEntity.tileY,
          );
          comparableEntities.index == -1 && comparableMap.tileType != 'tileW'
            ? this.move(enemyEntity, 1, 0)
            : console.log('going right must attack');
        } else {
          // Y
          // npc going left
          const comparableEntities = this.findObjFromArrByCoordinates(
            this.game.entities,
            enemyEntity.tileX - 1,
            enemyEntity.tileY,
          );
          const comparableMap = this.findObjFromArrByCoordinates(
            this.game.map,
            enemyEntity.tileX - 1,
            enemyEntity.tileY,
          );
          comparableEntities.index == -1 && comparableMap.tileType != 'tileW'
            ? this.move(enemyEntity, -1, 0)
            : console.log('going left must attack');
        }
      } else {
        if (distanceY > 0) {
          // npc goes bottom
          const comparableEntities = this.findObjFromArrByCoordinates(
            this.game.entities,
            enemyEntity.tileX,
            enemyEntity.tileY + 1,
          );
          const comparableMap = this.findObjFromArrByCoordinates(
            this.game.map,
            enemyEntity.tileX,
            enemyEntity.tileY + 1,
          );
          comparableEntities.index == -1 && comparableMap.tileType !== 'tileW'
            ? this.move(enemyEntity, 0, 1)
            : console.log('going bottom must attack');
        } else {
          // npc goes upper
          const comparableEntities = this.findObjFromArrByCoordinates(
            this.game.entities,
            enemyEntity.tileX,
            enemyEntity.tileY - 1,
          );
          const comparableMap = this.findObjFromArrByCoordinates(
            this.game.map,
            enemyEntity.tileX,
            enemyEntity.tileY - 1,
          );
          comparableEntities.index == -1 && comparableMap.tileType != 'tileW'
            ? this.move(enemyEntity, 0, -1)
            : console.log('going top must attack');
        }
      }

      setTimeout(() => {
        recursy();
      }, 500);
    };

    recursy();
  }

  move(entity, distaceX, distanceY) {
    const currentEntity = {
      ...entity,
      tileX: entity.tileX + distaceX,
      tileY: entity.tileY + distanceY,
    };
    const entityElem = document.getElementById(`${currentEntity.tileType}${currentEntity.id}`);

    entityElem.className = currentEntity.tileType;
    entityElem.style = `left: ${currentEntity.tileX * 50}px; top: ${currentEntity.tileY * 50}px`;

    this.game.entities[currentEntity.index] = currentEntity;
  }
}
