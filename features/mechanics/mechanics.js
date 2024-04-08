export class heroMechanics {
  // hero mechanics
  static heroEntityInfoAndSpawn(data) {
    const { game, hero } = data;

    // Information for spawn and for entity arr
    hero.entityInfo = game.randomCoordinatesOnEmptyTile(
      game.map,
      1,
      hero.tileType,
      game.maxX,
      game.maxY,
    )[0];
    hero.entityInfo = {
      ...hero.entityInfo,
      maxX: game.maxX,
      maxY: game.maxY,
      hp: hero.hp,
      atc: hero.atc,
      tileType: hero.tileType,
      id: hero.id,
    };

    hero.coordinates = {
      x: hero.entityInfo.tileX,
      y: hero.entityInfo.tileY,
    };

    // spawn
    hero.spawnEntity(hero.entityInfo, game.entities);
  }

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
