export class mechanics {
  static attackByHero(data) {
    const { enemiesAround, game, hero } = data;

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
          const newEntites = game.deleteObjFromArrById(game, enemy.id);
          game.entities = [...newEntites];
        }
      }
    });
  }
}
