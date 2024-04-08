export class commonMechanics {
  // hero mechanics
  static entityInfoAndSpawn(data) {
    const { game, entity } = data;

    // Information for spawn and for entity arr
    entity.entityInfo = game.randomCoordinatesOnEmptyTile(
      game.map,
      1,
      entity.tileType,
      game.maxX,
      game.maxY,
    )[0];
    entity.entityInfo = {
      ...entity.entityInfo,
      maxX: game.maxX,
      maxY: game.maxY,
      hp: entity.hp,
      atc: entity.atc,
      tileType: entity.tileType,
      id: entity.id,
    };

    entity.coordinates = {
      x: entity.entityInfo.tileX,
      y: entity.entityInfo.tileY,
    };

    // spawn
    entity.spawnEntity(entity.entityInfo, game.entities);
  }
}

export class heroMechanics {
  static heroInitKeyboard(self) {
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

  static heroMove(data) {
    const { game, hero, field, newX, newY, newCooordinatesMap } = data;

    // moving
    switch (newCooordinatesMap.tileType) {
      case 'tile':
        const entityElem = document.querySelector('.tileP');
        hero.coordinates.x = newX;
        hero.coordinates.y = newY;

        // change info in entities arr for hero
        const char = game.findObjFromArrById(game.entities, 'tileP');
        game.entities[char.index] = {
          ...char,
          tileX: hero.coordinates.x,
          tileY: hero.coordinates.y,
        };

        entityElem.style = `left: ${hero.coordinates.x * 50}px; top: ${hero.coordinates.y * 50}px;`;

        game.autoScrollToEntity(
          field,
          { ...hero.entityInfo, tileX: hero.coordinates.x, tileY: hero.coordinates.y },
          hero.entityInfo.maxX,
          hero.entityInfo.maxY,
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
        game.map[newCooordinatesMap.index].tileType = 'tile';

        // replace it with new tile
        let newTileHp = game.createElem('div', 'tile', 'tileHp' + newCooordinatesMap.index);
        // UI control of postition of map-tiles
        newTileHp.style = `left: ${newCooordinatesMap.tileX * 50}px; top: ${
          newCooordinatesMap.tileY * 50
        }px;`;
        field.append(newTileHp);

        hero.interactInventory('add', newCooordinatesMap);
        break;

      case 'tileSW':
        // old elem with HP
        const selectedSwordElem = document.getElementById(
          `${newCooordinatesMap.tileType + newCooordinatesMap.index}`,
        );
        const parentSword = selectedSwordElem.parentNode;
        parentSword.removeChild(selectedSwordElem);

        // change pre-render map (but dont call render, cuz it finds by id above and change)
        game.map[newCooordinatesMap.index].tileType = 'tile';

        // replace it with new tile
        let newTileSword = game.createElem('div', 'tile', 'tileSW' + newCooordinatesMap.index);
        // UI control of postition of map-tiles
        newTileSword.style = `left: ${newCooordinatesMap.tileX * 50}px; top: ${
          newCooordinatesMap.tileY * 50
        }px;`;
        field.append(newTileSword);

        hero.interactInventory('add', newCooordinatesMap);
        break;

      default:
        break;
    }
  }

  static heroAddToInventory(data) {
    const { game, hero, tile, inventoryElem } = data;
    // This stuff becomes elem soon (check comment about recursy right above..)
    let newStuff = game.createElem('img', 'stuff', `${tile.tileType}${tile.index}`);
    newStuff.src = tile.src;
    inventoryElem.append(newStuff);

    // (..) recursy with inventory iteraction
    newStuff.addEventListener('click', () => hero.interactInventory('use', tile, newStuff));
  }

  static heroUseFromInventory(data) {
    const { game, hero, tile } = data;
    if (tile.tileType == 'tileHP') {
      // change data in instance according entities arr
      const heroFomEntitiesArr = game.findObjFromArrById(game.entities, hero.id);
      hero.hp = heroFomEntitiesArr.hp + 5;
      game.entities[heroFomEntitiesArr.index].hp = hero.hp;

      // player hp from bar
      let charElem = document.querySelector('.tileP');
      let hpBarElem = charElem.childNodes[0];
      charElem.removeChild(hpBarElem);
      let newHpBarElem = game.createElem('span', 'health', null, hero.hp);
      charElem.prepend(newHpBarElem);

      // player hp from inventory
      let hpInventoryElem = document.querySelector('.hpInventory');
      let parentInventoryData = hpInventoryElem.parentNode;
      parentInventoryData.removeChild(hpInventoryElem);
      let newHpInventoryElem = game.createElem('span', 'hpInventory', null, hero.hp);
      parentInventoryData.append(newHpInventoryElem);
    }
    if (tile.tileType == 'tileSW') {
      // change data in instance according entities arr
      const heroFomEntitiesArr = game.findObjFromArrById(game.entities, hero.id);
      hero.atc = heroFomEntitiesArr.atc + 2;
      hero.game.entities[heroFomEntitiesArr.index].atc = hero.atc;

      // player atc from inventory
      let atcInventoryElem = document.querySelector('.atcInventory');
      let parentInventoryData = atcInventoryElem.parentNode;
      parentInventoryData.removeChild(atcInventoryElem);
      let newAtcInventoryElem = game.createElem('span', 'atcInventory', null, hero.atc);
      parentInventoryData.append(newAtcInventoryElem);
    }
  }

  static heroAttack(data) {
    const { enemiesAround, game, hero } = data;
    // go on every enemy
    enemiesAround.forEach((enemy) => {
      if (enemy.index !== -1) {
        // damage according hero atc
        game.entities[enemy.index].hp = enemy.hp - hero.atc;
        const actualEnemy = game.entities[enemy.index];
        // rerender enemy
        let entityElem = document.getElementById(`${enemy.tileType + enemy.id}`);
        let parentEntity = entityElem.parentNode;

        // upd hp
        let hpBarElem = entityElem.childNodes[0];
        entityElem.removeChild(hpBarElem);
        let newHpBarElem = game.createElem('span', 'health', null, actualEnemy.hp);
        entityElem.prepend(newHpBarElem);

        if (actualEnemy.hp <= 0) {
          parentEntity.removeChild(entityElem);
          const newEntites = game.deleteObjFromArrById(game.entities, enemy.id);
          game.entities = [...newEntites];
        }
      }
    });
  }
}

export class enemyMechanics {
  static enemyRecursiveMoveLogic(data) {
    const { game, entity, id } = data;

    const enemyEntity = game.findObjFromArrById(game.entities, id);
    const hero = game.findObjFromArrById(game.entities, 'tileP');

    // calculate distances between hero and enemy
    let distaceX = hero.tileX - enemyEntity.tileX;
    let distanceY = hero.tileY - enemyEntity.tileY;

    const handleDecisionOfMove = (direction) => {
      if (direction == 'right') {
        const comparableEntities = game.findObjFromArrByCoordinates(
          game.entities,
          enemyEntity.tileX + 1,
          enemyEntity.tileY,
        );
        const comparableMap = game.findObjFromArrByCoordinates(
          game.map,
          enemyEntity.tileX + 1,
          enemyEntity.tileY,
        );
        comparableEntities.index == -1 && comparableMap.tileType != 'tileW'
          ? entity.move(enemyEntity, 1, 0)
          : entity.attack(comparableEntities);
      }

      if (direction == 'left') {
        const comparableEntities = game.findObjFromArrByCoordinates(
          game.entities,
          enemyEntity.tileX - 1,
          enemyEntity.tileY,
        );
        const comparableMap = game.findObjFromArrByCoordinates(
          game.map,
          enemyEntity.tileX - 1,
          enemyEntity.tileY,
        );
        comparableEntities.index == -1 && comparableMap.tileType != 'tileW'
          ? entity.move(enemyEntity, -1, 0)
          : entity.attack(comparableEntities);
      }

      if (direction == 'bottom') {
        const comparableEntities = game.findObjFromArrByCoordinates(
          game.entities,
          enemyEntity.tileX,
          enemyEntity.tileY + 1,
        );
        const comparableMap = game.findObjFromArrByCoordinates(
          game.map,
          enemyEntity.tileX,
          enemyEntity.tileY + 1,
        );
        comparableEntities.index == -1 && comparableMap.tileType != 'tileW'
          ? entity.move(enemyEntity, 0, 1)
          : entity.attack(comparableEntities);
      }

      if (direction == 'up') {
        const comparableEntities = game.findObjFromArrByCoordinates(
          game.entities,
          enemyEntity.tileX,
          enemyEntity.tileY - 1,
        );
        const comparableMap = game.findObjFromArrByCoordinates(
          game.map,
          enemyEntity.tileX,
          enemyEntity.tileY - 1,
        );
        comparableEntities.index == -1 && comparableMap.tileType != 'tileW'
          ? entity.move(enemyEntity, 0, -1)
          : entity.attack(comparableEntities);
      }
    };

    // according absolutes of distace, execute .move()
    if (Math.abs(distaceX) > Math.abs(distanceY)) {
      if (distaceX > 0) {
        // npc going right way
        handleDecisionOfMove('right');
      } else {
        // npc going left
        handleDecisionOfMove('left');
      }
    } else {
      if (distanceY > 0) {
        // npc goes bottom
        handleDecisionOfMove('bottom');
      } else {
        // npc goes upper
        handleDecisionOfMove('up');
      }
    }

    setTimeout(() => {
      this.enemyRecursiveMoveLogic(data);
    }, 500);
  }

  static enemyMove(data) {
    const { entity, distaceX, distanceY, game } = data;

    const currentEntity = {
      ...entity,
      tileX: entity.tileX + distaceX,
      tileY: entity.tileY + distanceY,
    };
    const entityElem = document.getElementById(`${currentEntity.tileType}${currentEntity.id}`);

    entityElem.className = currentEntity.tileType;
    entityElem.style = `left: ${currentEntity.tileX * 50}px; top: ${currentEntity.tileY * 50}px`;

    game.entities[currentEntity.index] = currentEntity;
  }

  static enemyAttack(data) {
    const { characterToBeat, game, enemy } = data;

    if (characterToBeat !== -1 && characterToBeat.tileType == 'tileP') {
      // damaging according this npc atc
      game.entities[characterToBeat.index].hp = characterToBeat.hp - enemy.atc;
      const actualCharacter = game.entities[characterToBeat.index];

      // rerender enemy
      let characterElem = document.getElementById(`${characterToBeat.tileType}`);
      let parentCharacter = characterElem.parentNode;

      // updHp
      let hpBarElem = characterElem.childNodes[0];
      characterElem.removeChild(hpBarElem);

      let newHpBarElem = game.createElem('span', 'health', null, actualCharacter.hp);
      characterElem.prepend(newHpBarElem);

      // upd player hp from inventory
      let hpInventoryElem = document.querySelector('.hpInventory');
      let parentInventoryData = hpInventoryElem.parentNode;
      parentInventoryData.removeChild(hpInventoryElem);

      let newHpInventoryElem = game.createElem('span', 'hpInventory', null, actualCharacter.hp);
      parentInventoryData.append(newHpInventoryElem);

      if (actualCharacter.hp <= 0) {
        parentCharacter.removeChild(characterElem);
        const newEntities = game.deleteObjFromArrById(game.entities, characterToBeat.id);
        game.entities = [...newEntities];
        // restart
        setTimeout(() => {
          alert('You died..');
          location.reload();
        }, 100);
      }
    }
  }
}
