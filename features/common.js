export class Functions {
  randomNumber(countOfNumbers) {
    return Math.floor(Math.random() * countOfNumbers);
  }
  compareTiles(mapTile, structureTile) {
    return mapTile.tileX === structureTile.tileX && mapTile.tileY === structureTile.tileY;
  }
  findObjFromArrByCoordinates(map, x, y) {
    // you must remember coordinates are always must be like tileX and tileY keys
    const obj = map.find((obj) => obj.tileX === x && obj.tileY === y);
    const index = map.findIndex((obj) => obj.tileX === x && obj.tileY === y);
    return {
      ...obj,
      index,
    };
  }
  randomCoordinatesForRoads(xy, count) {
    // xy here is vector (x or y)
    let arr = [];
    for (let index = 0; index < count; index++) {
      let value;
      if (xy == 'x') {
        do {
          value = this.randomNumber(100);
        } while (value > this.maxX || arr.includes(value));
      }
      if (xy == 'y') {
        do {
          value = this.randomNumber(100);
        } while (value > this.maxY || arr.includes(value));
      }

      arr.push(value);
    }
    return arr;
  }
  randomCoordinatesOnEmptyTile(map, count, tileType, maxX, maxY) {
    // this func used to return tile with {tileType: 'tile'}
    // because stuff can spawn only on free tile
    let coordinates = [];
    for (let index = 0; index < count; index++) {
      let x_coordinate = this.randomNumber(100);
      let y_coordinate = this.randomNumber(100);

      do {
        x_coordinate = this.randomNumber(100);
      } while (x_coordinate > maxX);
      do {
        y_coordinate = this.randomNumber(100);
      } while (y_coordinate > maxY);

      // it includes index of coordinate!!
      const comparable = this.findObjFromArrByCoordinates(map, x_coordinate, y_coordinate);

      if (comparable.tileType === 'tile') {
        coordinates.push({ ...comparable, tileType });
      } else {
        // extra iteration if its not empty tile
        index--;
      }
    }

    return coordinates;
  }

  autoScrollToEntity(field, entity, maxX, maxY) {
    field.scrollTo(entity.tileX * maxX, entity.tileY * maxY);
  }
}
