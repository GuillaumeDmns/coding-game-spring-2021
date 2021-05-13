import Cell from "./objects/Cell";
import Tree from "./objects/Tree";
import doAction from "./utils/action.utils";
import Action from "./objects/Action";

declare function readline(args?: any): string;

const numberOfCells: number = parseInt(readline()); // 37

const cellArray: Array<Cell> = new Array<Cell>();
const dayCompletedALO: Array<number> = new Array<number>();
const daySeeded: Array<number> = new Array<number>();

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
        treeArray.push(new Tree(cellIndex, size, isMine, isDormant, cellArray.filter(cell => cell.index === cellIndex)[0]));
    }

    const possibleGrow: Array<number> = new Array<number>();
    const possibleSeed: Array<[source: number, destination: number]> = new Array<[source: number, destination: number]>();
    const possibleComplete: Array<number> = new Array<number>();

    const numberOfPossibleMoves: number = parseInt(readline());
    for (let i = 0; i < numberOfPossibleMoves; i++) {
        const possibleMove: string = readline();
        const possibleMoveSplit: Array<string> = possibleMove.split(" ");
        switch (possibleMoveSplit[0]) {
            case Action.GROW:
                possibleGrow.push(parseInt(possibleMoveSplit[1]));
                break;
            case Action.SEED:
                possibleSeed.push([parseInt(possibleMoveSplit[1]), parseInt(possibleMoveSplit[2])]);
                break;
            case Action.COMPLETE:
                possibleComplete.push(parseInt(possibleMoveSplit[1]));
                break;
            default:
                break;
        }
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
    const myTreesSize0: Array<Tree> = myTrees.filter(tree => tree.size === 0);

    const myTreesSize3NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 3);
    const myTreesSize2NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 2);
    const myTreesSize1NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 1);
    const myTreesSize0NonDormant: Array<Tree> = myTreesNonDormant.filter(tree => tree.size === 0);

    const canSeed: boolean = possibleSeed.length > 0;
    const canGrow: boolean = possibleGrow.length > 0;
    const canGrow0To1: boolean = possibleGrow.filter(g => myTrees.filter(t => t.cellIndex === g)[0].size === 0).length > 0;
    const canGrow1To2: boolean = possibleGrow.filter(g => myTrees.filter(t => t.cellIndex === g)[0].size === 1).length > 0;
    const canGrow2To3: boolean = possibleGrow.filter(g => myTrees.filter(t => t.cellIndex === g)[0].size === 2).length > 0;
    const canComplete: boolean = possibleComplete.length > 0;

    const isCurrentDayCompletedALO: boolean = dayCompletedALO.filter(d => d === day).length > 0;

    const MAX_TREE_3: number = 5;
    const MAX_DISTANCE_MY_TREES: number = 2;
    const WEIGHT_DAYS_IN_ADVANCE: number = 3;

    const getBestCellsToSeed = (): [a?: number, b?: number] => {


        const sortedSeed: Array<[source: number, destination: number]> = possibleSeed.filter(seed => {

            const destination: Cell = cellArray.filter(cell => cell.index === seed[1])[0];
            if (myTrees.filter(tree =>
                (tree.cellIndex === destination.neigh0) ||
                (tree.cellIndex === destination.neigh1) ||
                (tree.cellIndex === destination.neigh2) ||
                (tree.cellIndex === destination.neigh3) ||
                (tree.cellIndex === destination.neigh4) ||
                (tree.cellIndex === destination.neigh5)).length > 0) return false;

            return myTrees.filter(tree => {
                const cellOfThisTree: Cell = cellArray.filter(c => c.index === tree.cellIndex)[0];
                return !(((destination.coordinates.x !== cellOfThisTree.coordinates.x) || (Math.abs(destination.coordinates.y - cellOfThisTree.coordinates.y) > MAX_DISTANCE_MY_TREES) || (Math.abs(destination.coordinates.z - cellOfThisTree.coordinates.z) > MAX_DISTANCE_MY_TREES)) &&
                    ((destination.coordinates.y !== cellOfThisTree.coordinates.y) || (Math.abs(destination.coordinates.x - cellOfThisTree.coordinates.x) > MAX_DISTANCE_MY_TREES) || (Math.abs(destination.coordinates.z - cellOfThisTree.coordinates.z) > MAX_DISTANCE_MY_TREES)) &&
                    ((destination.coordinates.z !== cellOfThisTree.coordinates.z) || (Math.abs(destination.coordinates.x - cellOfThisTree.coordinates.x) > MAX_DISTANCE_MY_TREES) || (Math.abs(destination.coordinates.y - cellOfThisTree.coordinates.y) > MAX_DISTANCE_MY_TREES)))

            }).length <= 0;


        }).sort((seedA, seedB) => cellArray.filter(c => c.index === seedA[1])[0].richness > cellArray.filter(c => c.index === seedB[1])[0].richness ? -1 : 1);

        return sortedSeed.length > 0 ? sortedSeed[0] : [undefined, undefined];

    }

    const getWeightOfTree = (tree: Tree, toUpgrade: boolean): number => {
        const sunDirection = day % 6;
        const treeSize = tree.size + (toUpgrade ? 1 : 0);
        let weight: number = 0;

        const getNeighWeight = (cell: Cell, direction: number, distanceFromInitialTree: number, isSunDirection: boolean): number => {
            if (distanceFromInitialTree > 3) return 0;

            const neighsArray: Array<number> = cell.getNeighSortedArray();
            const goodNeighCell: Cell = cellArray.filter(cell => cell.index === neighsArray[direction])[0];
            if (goodNeighCell && neighsArray[direction] !== -1) {
                const potentialTrees: Array<Tree> = treeArray.filter(tree => tree.cellIndex === goodNeighCell.index);
                const weightCompute = (): number => {

                    if (potentialTrees.length > 0) {
                        if (potentialTrees[0].isMine) {
                            if (isSunDirection) {
                                if (distanceFromInitialTree <= treeSize && potentialTrees[0].size <= treeSize) {
                                    if (tree.cellIndex === 3) console.warn(isSunDirection, potentialTrees[0].size, "because Af tree", potentialTrees[0].cellIndex);
                                    return potentialTrees[0].size;
                                }
                            } else { // !isSunDirection
                                if (distanceFromInitialTree <= potentialTrees[0].size && treeSize <= potentialTrees[0].size) {
                                    if (tree.cellIndex === 3) console.warn(isSunDirection, potentialTrees[0].size, "because Bf tree", potentialTrees[0].cellIndex);
                                    return treeSize;
                                }
                            }
                        } else {
                            if (isSunDirection) {
                                if (tree.cellIndex === 3) console.warn(isSunDirection, -1 * potentialTrees[0].size, "because Cf tree", potentialTrees[0].cellIndex);
                                if (distanceFromInitialTree <= treeSize && potentialTrees[0].size <= treeSize) {
                                    return -1 * potentialTrees[0].size;
                                }
                            } else { // !isSunDirection
                                if (distanceFromInitialTree <= potentialTrees[0].size && treeSize <= potentialTrees[0].size) {
                                    if (tree.cellIndex === 3) console.warn(isSunDirection, potentialTrees[0].size, "because Df tree", potentialTrees[0].cellIndex);
                                    return treeSize;
                                }
                            }
                        }
                    }
                    return 0;
                }
                return getNeighWeight(goodNeighCell, direction, distanceFromInitialTree + 1, isSunDirection) + weightCompute();
            }
            return 0;
        }


        for (var i = sunDirection + 1; i <= sunDirection + WEIGHT_DAYS_IN_ADVANCE; i++) {
            weight += getNeighWeight(tree.cell, i % 6, 1, true);
            weight += getNeighWeight(tree.cell, (i + 3) % 6, 1, false);
        }

        return weight;
    }

    const getBestTreeToComplete = (): number => {
        myTreesSize3NonDormant.sort((treeA, treeB) => {
            const weightA: number = getWeightOfTree(treeA, false);
            const weightB: number = getWeightOfTree(treeB, false);

            if (weightA !== weightB) return weightB - weightA;

            return treeA.cellIndex - treeB.cellIndex;
        })

        return myTreesSize3NonDormant[0].cellIndex;
    }

    const getBestTreeToGrow = (): number => {
        possibleGrow.sort((treeA, treeB) => {
            const weightA: number = getWeightOfTree(myTreesNonDormant.filter(tree => tree.cellIndex === treeA)[0], false);
            const weightAUpgraded: number = getWeightOfTree(myTreesNonDormant.filter(tree => tree.cellIndex === treeA)[0], true);
            const weightB: number = getWeightOfTree(myTreesNonDormant.filter(tree => tree.cellIndex === treeB)[0], false);
            const weightBUpgraded: number = getWeightOfTree(myTreesNonDormant.filter(tree => tree.cellIndex === treeB)[0], true);

            const AEarning: number = weightA - weightAUpgraded;
            const BEarning: number = weightB - weightBUpgraded;

            if (AEarning !== BEarning) return BEarning - AEarning;

            return treeA - treeB;
        }).forEach(t => {
            const weightA: number = getWeightOfTree(myTreesNonDormant.filter(tree => tree.cellIndex === t)[0], false);
            const weightAUpgraded: number = getWeightOfTree(myTreesNonDormant.filter(tree => tree.cellIndex === t)[0], true);
            console.warn("tree", t, ":", weightA, "--->", weightAUpgraded);
        })

        return possibleGrow[0];
    }

    ////////////////////////



    // Write an action using console.log()
    // To debug: console.error('Debug messages...');

    const finalAction = (): string => {
        if (myTreesNonDormant.length) {
            if (myTreesNonDormant[0].size === 3) { // BIGGEST SIZE = 3
                if (day > 20) {
                    if (canComplete) {
                        dayCompletedALO.push(day);
                        return doAction(Action.COMPLETE, getBestTreeToComplete(), undefined, undefined);
                    } else {
                        return doAction(Action.WAIT, undefined, undefined, "burger");
                    }
                    // if (day > 12 && !isCurrentDayCompletedALO && canComplete) {
                    //     dayCompletedALO.push(day);
                    //     return doAction(Action.COMPLETE, myTreesNonDormant[0].cellIndex, null, null);
                } else if (myTreesSize3NonDormant.length < MAX_TREE_3) {
                    if (canGrow) {
                        return doAction(Action.GROW, getBestTreeToGrow(), undefined, undefined);
                    } else if (canSeed) {
                        const [sourceSeed, destinationSeed] = getBestCellsToSeed();
                        if (sourceSeed !== undefined && destinationSeed !== undefined) {
                            return doAction(Action.SEED, sourceSeed, destinationSeed, undefined);
                        } else {
                            return doAction(Action.WAIT, undefined, undefined, "sandwich");
                        }
                    } else {
                        return doAction(Action.WAIT, undefined, undefined, "salade");
                    }
                } else {
                    if (canComplete) {
                        dayCompletedALO.push(day);
                        return doAction(Action.COMPLETE, getBestTreeToComplete(), undefined, undefined);
                    } else {
                        return doAction(Action.WAIT, undefined, undefined, "pasta");
                    }
                }
            }

            if (day === 23) {
                if ((myTreesSize0.length === 0) || (sun % 3 >= myTreesSize0.length)) {
                    if (canSeed) {
                        return doAction(Action.SEED, possibleSeed[0][0], possibleSeed[0][1], undefined);
                    }
                }
                return doAction(Action.WAIT, undefined, undefined, "patate");
            }

            if (myTreesNonDormant[0].size === 2) { // BIGGEST SIZE = 2
                if (canGrow) {
                    return doAction(Action.GROW, getBestTreeToGrow(), undefined, undefined);
                } else if (canSeed) {
                    const [sourceSeed, destinationSeed] = getBestCellsToSeed();
                    if (sourceSeed !== undefined && destinationSeed !== undefined) {
                        return doAction(Action.SEED, sourceSeed, destinationSeed, undefined);
                    } else {
                        return doAction(Action.WAIT, undefined, undefined, "soupe");
                    }
                }
                else {
                    return doAction(Action.WAIT, undefined, undefined, "tacos");
                }
            }
            else { // BIGGEST SIZE = 1
                if (canGrow) {
                    return doAction(Action.GROW, getBestTreeToGrow(), undefined, undefined);
                } else {
                    return doAction(Action.WAIT, undefined, undefined, "biscuit");
                }
            }
        } else {
            return doAction(Action.WAIT, undefined, undefined, "mozzarella");
        }
    }

    console.log(finalAction());


}

