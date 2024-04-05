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
  findObjFromArrById(arr, id) {
    // you must remember coordinates are always must be like tileX and tileY keys
    const obj = arr.find((obj) => obj.id == id);
    const index = arr.findIndex((obj) => obj.id == id);
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

  entityAround(entitiesArr, coordinates) {
    // returns array of coordinates of entities around
    let arr = [];
    // topLeft
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x - 1, coordinates.y - 1));
    // top
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x, coordinates.y - 1));
    // topRight
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x + 1, coordinates.y - 1));

    // right
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x + 1, coordinates.y));

    // bottomRight
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x + 1, coordinates.y + 1));
    // bottom
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x, coordinates.y + 1));
    // bottomLeft
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x - 1, coordinates.y + 1));

    // left
    arr.push(this.findObjFromArrByCoordinates(entitiesArr, coordinates.x - 1, coordinates.y));

    return arr;
  }

  deleteObjFromArrById(entitiesMap, id) {
    // deleting obj from arr.
    // spread new arr in old one for no mutation!
    const newArr = entitiesMap.filter((entity) => entity.id !== id);
    return newArr;
  }

  // NEXT DOM
  createElem(tag, className, id, textContent, src) {
    let elem = document.createElement(tag);
    className ? (elem.className = className) : null;
    id ? (elem.id = id) : null;
    textContent ? (elem.textContent = textContent) : null;

    return elem;
  }
}
