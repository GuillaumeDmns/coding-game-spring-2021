import Coordinates from "./Coordinates";
import {initialCells} from "../utils/init.utils";

class Cell {
    coordinates: Coordinates;
    index: number;
    richness: number;
    neigh0: number;
    neigh1: number;
    neigh2: number;
    neigh3: number;
    neigh4: number;
    neigh5: number;


    constructor(index: number, richness: number, neigh0: number, neigh1: number, neigh2: number, neigh3: number, neigh4: number, neigh5: number) {
        this.coordinates = initialCells[index];
        this.index = index;
        this.richness = richness;
        this.neigh0 = neigh0;
        this.neigh1 = neigh1;
        this.neigh2 = neigh2;
        this.neigh3 = neigh3;
        this.neigh4 = neigh4;
        this.neigh5 = neigh5;
    }

    getNeighSortedArray(): Array<number> {
        const neighSortedArray: Array<number> = new Array<number>();
        neighSortedArray.push(this.neigh0);
        neighSortedArray.push(this.neigh1);
        neighSortedArray.push(this.neigh2);
        neighSortedArray.push(this.neigh3);
        neighSortedArray.push(this.neigh4);
        neighSortedArray.push(this.neigh5);
        return neighSortedArray;
    }
}

export default Cell;