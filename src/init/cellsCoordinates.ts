import Coordinates from "../objects/Coordinates";


export const initialCells : Record<number, Coordinates> = {
    0: new Coordinates(0, 0, 0),
    1: new Coordinates(0, 1, -1),
    2: new Coordinates(-1, 1, 0),
    3: new Coordinates(-1, 0, 1),
    4: new Coordinates(0, -1, 1),
    5: new Coordinates(1, -1, 0),
    6: new Coordinates(1, 0, -1),
    7: new Coordinates(0, 2, -2),
    8: new Coordinates(-1, 2, -1),
    9: new Coordinates(-2, 2, 0),
    10: new Coordinates(-2, 1, 1),
    11: new Coordinates(-2, 0, 2),
    12: new Coordinates(-1, -1, 2),
    13: new Coordinates(0, -2, 2),
    14: new Coordinates(1, -2, 1),
    15: new Coordinates(2, -2, 0),
    16: new Coordinates(2, -1, -1),
    17: new Coordinates(2, 0, -2),
    18: new Coordinates(1, 1, -2),
    19: new Coordinates(0, 3, -3),
    20: new Coordinates(-1, 3, -2),
    21: new Coordinates(-2, 3, -1),
    22: new Coordinates(-3, 3, 0),
    23: new Coordinates(-3, 2, 1),
    24: new Coordinates(-3, 1, 2),
    25: new Coordinates(-3, 0, 3),
    26: new Coordinates(-2, -1, 3),
    27: new Coordinates(-1, -2, 3),
    28: new Coordinates(0, -3, 3),
    29: new Coordinates(1, -3, 2),
    30: new Coordinates(2, -3, 1),
    31: new Coordinates(3, -3, 0),
    32: new Coordinates(3, -2, -1),
    33: new Coordinates(3, -1, -2),
    34: new Coordinates(3, 0, -3),
    35: new Coordinates(2, 1, -3),
    36: new Coordinates(1, 2, -3),
}

export const distanceBetween = (coordinateA: Coordinates, coordinateB: Coordinates) => {
    return (Math.abs(coordinateA.x - coordinateB.x) + Math.abs(coordinateA.y - coordinateB.y) + Math.abs(coordinateA.z - coordinateB.z)) / 2;
}