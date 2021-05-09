import Cell from "./objects/Cell";
import Tree from "./objects/Tree";
import {distanceBetween} from "./init/cellsCoordinates";
import doAction from "./utils/action.utils";
import Action from "./objects/Action";

declare function readline(args?: any): string;

const numberOfCells: number = parseInt(readline()); // 37

const cellArray: Array<Cell> = new Array<Cell>();
for (let i = 0; i < numberOfCells; i++) {
    var inputs: string[] = readline().split(' ');
    const index: number = parseInt(inputs[0]); // 0 is the center cell, the next cells spiral outwards
    const richness: number = parseInt(inputs[1]); // 0 if the cell is unusable, 1-3 for usable cells
    const neigh0: number = parseInt(inputs[2]); // the index of the neighbouring cell for each direction
    const neigh1: number = parseInt(inputs[3]);
    const neigh2: number = parseInt(inputs[4]);
    const neigh3: number = parseInt(inputs[5]);
    const neigh4: number = parseInt(inputs[6]);
    const neigh5: number = parseInt(inputs[7]);

    cellArray.push(new Cell(index, richness, neigh0, neigh1, neigh2, neigh3, neigh4, neigh5));
}

// game loop
while (true) {
    const treeArray: Array<Tree> = new Array<Tree>();
    const day: number = parseInt(readline()); // the game lasts 24 days: 0-23
    const nutrients: number = parseInt(readline()); // the base score you gain from the next COMPLETE action
    var inputs1: string[] = readline().split(' ');
    const sun: number = parseInt(inputs1[0]); // your sun points
    const score: number = parseInt(inputs1[1]); // your current score
    var inputs2: string[] = readline().split(' ');
    const oppSun: number = parseInt(inputs2[0]); // opponent's sun points
    const oppScore: number = parseInt(inputs2[1]); // opponent's score
    const oppIsWaiting: boolean = inputs2[2] !== '0'; // whether your opponent is asleep until the next day
    const numberOfTrees: number = parseInt(readline()); // the current amount of trees
    for (let i = 0; i < numberOfTrees; i++) {

        var inputs3: string[] = readline().split(' ');
        const cellIndex: number = parseInt(inputs3[0]); // location of this tree
        const size: number = parseInt(inputs3[1]); // size of this tree: 0-3
        const isMine: boolean = inputs3[2] !== '0'; // 1 if this is your tree
        const isDormant: boolean = inputs3[3] !== '0'; // 1 if this tree is dormant


        treeArray.push(new Tree(cellIndex, size, isMine, isDormant));





    }
    const numberOfPossibleMoves: number = parseInt(readline());
    for (let i = 0; i < numberOfPossibleMoves; i++) {
        const possibleMove: string = readline();
    }

    ////////////////////////
    const myTrees: Array<Tree> = treeArray.filter(tree => tree.isMine)
        .sort((treeA, treeB) => {
            if (treeA.size !== treeB.size) {
                return treeA.size < treeB.size ? 1 : -1;
            }
            const cellA: Cell = cellArray.filter(cell => cell.index === treeA.cellIndex)[0];
            const cellB: Cell = cellArray.filter(cell => cell.index === treeB.cellIndex)[0];
            return cellA.richness < cellB.richness ? 1 : -1;
        });

    const myTreesNonDormant: Array<Tree> = myTrees.filter(tree => !tree.isDormant);

    const myTreesSize3: Array<Tree> = myTrees.filter(tree => tree.size === 3);
    const myTreesSize2: Array<Tree> = myTrees.filter(tree => tree.size === 2);
    const myTreesSize1: Array<Tree> = myTrees.filter(tree => tree.size === 1);
    const myTreesSize0: Array<Tree> = myTrees.filter(tree => tree.size === 0);

    const myTreesSize3NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 3);
    const myTreesSize2NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 2);
    const myTreesSize1NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 1);
    const myTreesSize0NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 0);

    const haveIEnoughSunToSeed: boolean = sun >= myTreesSize0.length;
    const haveIEnoughSunToGrow0To1: boolean = sun >= 1 + myTreesSize1.length;
    const haveIEnoughSunToGrow1To2: boolean = sun >= 3 + myTreesSize2.length;
    const haveIEnoughSunToGrow2To3: boolean = sun >= 7 + myTreesSize3.length;
    const haveIEnoughToComplete: boolean = sun >= 4;

    const MAX_TREE_3: number = 5;
    const MAX_DISTANCE_MY_TREES: number = 2;

    const getBestCellsToSeed = (maxDistance: number) => {
        cellArray
            .filter(cell => cell.richness > 0 && treeArray.filter(tree => tree.cellIndex === cell.index).length === 0)
            .filter(cell => {
                return myTrees
                    .some(tree => {
                        return ((cell.coordinates.x !== tree.coordinates.x) || (Math.abs(cell.coordinates.y - tree.coordinates.y) > MAX_DISTANCE_MY_TREES) || (Math.abs(cell.coordinates.z - tree.coordinates.z) > MAX_DISTANCE_MY_TREES)) &&
                            ((cell.coordinates.y !== tree.coordinates.y) || (Math.abs(cell.coordinates.x - tree.coordinates.x) > MAX_DISTANCE_MY_TREES) || (Math.abs(cell.coordinates.z - tree.coordinates.z) > MAX_DISTANCE_MY_TREES)) &&
                            ((cell.coordinates.z !== tree.coordinates.z) || (Math.abs(cell.coordinates.x - tree.coordinates.x) > MAX_DISTANCE_MY_TREES) || (Math.abs(cell.coordinates.y - tree.coordinates.y) > MAX_DISTANCE_MY_TREES))
                })
            })


        const treesCanSeed: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 2 && tree.size === maxDistance);
        let interestingCells: Record<number, number> = {}; // cell index - tree index
        treesCanSeed.forEach(tree => {
            cellArray.filter(cell => cell.richness > 0 &&
                             treeArray.filter(tree => tree.cellIndex === cell.index).length === 0 &&
                             distanceBetween(cell.coordinates, tree.coordinates) <= tree.size &&
                             ((cell.coordinates.x !== tree.coordinates.x) || (Math.abs(cell.coordinates.y - tree.coordinates.y) > MAX_DISTANCE_MY_TREES) || (Math.abs(cell.coordinates.z - tree.coordinates.z) > MAX_DISTANCE_MY_TREES)) &&
                             ((cell.coordinates.y !== tree.coordinates.y) || (Math.abs(cell.coordinates.x - tree.coordinates.x) > MAX_DISTANCE_MY_TREES) || (Math.abs(cell.coordinates.z - tree.coordinates.z) > MAX_DISTANCE_MY_TREES)) &&
                             ((cell.coordinates.z !== tree.coordinates.z) || (Math.abs(cell.coordinates.x - tree.coordinates.x) > MAX_DISTANCE_MY_TREES) || (Math.abs(cell.coordinates.y - tree.coordinates.y) > MAX_DISTANCE_MY_TREES)))
                     .forEach(cell => {
                         interestingCells[cell.index] = tree.cellIndex;
                         console.warn(cell.index + " with tree " + tree.cellIndex);
                     });
        })
        return interestingCells;
    }

    ////////////////////////



    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    const finalAction = (): string => {
        if (myTreesNonDormant.length) {
            if (myTreesNonDormant[0].size < 2) {
                if (myTreesSize1NonDormant.length && haveIEnoughSunToGrow1To2) {
                    return doAction(Action.GROW, myTreesSize1NonDormant[0].cellIndex);
                } else if (myTreesSize0NonDormant.length && haveIEnoughSunToGrow0To1) {
                    return doAction(Action.GROW, myTreesSize0NonDormant[0].cellIndex);
                } else {
                    return doAction(Action.WAIT, null, null, "biscuit");
                }
            } else {
                if (myTreesNonDormant[0].size === 2) {
                    if (haveIEnoughSunToGrow2To3) {
                        return doAction(Action.GROW, myTreesNonDormant[0].cellIndex);
                    } else if (haveIEnoughSunToSeed) {
                        const interestingCells: Record<number, number> = getBestCellsToSeed(2);
                        if (Object.keys(interestingCells).length) {
                            return doAction(Action.SEED, interestingCells[Object.keys(interestingCells)[0]], Object.keys(interestingCells)[0]);
                        } else {
                            return doAction(Action.WAIT, null, null, "soupe");
                        }
                    }
                    else {
                        return doAction(Action.WAIT, null, null, "tacos");
                    }
                } else { // myTreesNonDormant[0].size = 3
                    if (day > 20) {
                        if (haveIEnoughToComplete) {
                            return doAction(Action.COMPLETE, myTreesNonDormant[0].cellIndex);
                        } else {
                            return doAction(Action.WAIT, null, null, "burger");
                        }
                    } else if (myTreesSize3NonDormant.length < MAX_TREE_3) {
                        if (myTreesSize2NonDormant.length && haveIEnoughSunToGrow2To3) {
                            return doAction(Action.GROW, myTreesSize2NonDormant[0].cellIndex);
                        } else if (myTreesSize1NonDormant.length && haveIEnoughSunToGrow1To2) {
                            return doAction(Action.GROW, myTreesSize1NonDormant[0].cellIndex);
                        } else if (myTreesSize0NonDormant.length && haveIEnoughSunToGrow0To1) {
                            return doAction(Action.GROW, myTreesSize0NonDormant[0].cellIndex);
                        } else if (haveIEnoughSunToSeed) {
                            const interestingCells: Record<number, number> = getBestCellsToSeed(3);
                            if (Object.keys(interestingCells).length) {
                                return doAction(Action.SEED, interestingCells[Object.keys(interestingCells)[0]], Object.keys(interestingCells)[0]);
                            } else {
                                return doAction(Action.WAIT, null, null, "sandwich");
                            }
                        } else {
                            return doAction(Action.WAIT, null, null, "salade");
                        }
                    } else {
                        if (myTreesSize3NonDormant.length && haveIEnoughToComplete) {
                            return doAction(Action.COMPLETE, myTreesSize3NonDormant[0].cellIndex);
                        } else {
                            return doAction(Action.WAIT, null, null, "pasta");
                        }
                    }
                }
            }
        } else {
            return doAction(Action.WAIT, null, null, "mozzarella");
        }
    }

    console.log(finalAction());


}
