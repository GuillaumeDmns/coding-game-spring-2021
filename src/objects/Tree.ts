import Coordinates from "./Coordinates";
import {initialCells} from "../init/cellsCoordinates";

class Tree {
    coordinates: Coordinates;
    cellIndex: number;
    size: number;
    isMine: boolean;
    isDormant: boolean;

    constructor(cellIndex: number, size: number, isMine: boolean, isDormant: boolean) {
        this.coordinates = initialCells[cellIndex];
        this.cellIndex = cellIndex;
        this.size = size;
        this.isMine = isMine;
        this.isDormant = isDormant;
    }
}

export default Tree;