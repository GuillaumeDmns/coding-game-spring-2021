import Coordinates from "./Coordinates";
import Cell from "./Cell";
import {initialCells} from "../utils/init.utils";

class Tree {
    coordinates: Coordinates;
    cellIndex: number;
    size: number;
    isMine: boolean;
    isDormant: boolean;
    cell: Cell;

    constructor(cellIndex: number, size: number, isMine: boolean, isDormant: boolean, cell: Cell) {
        this.coordinates = initialCells[cellIndex];
        this.cellIndex = cellIndex;
        this.size = size;
        this.isMine = isMine;
        this.isDormant = isDormant;
        this.cell = cell;
    }
}

export default Tree;