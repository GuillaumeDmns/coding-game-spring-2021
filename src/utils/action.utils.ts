import Action from "../objects/Action";

const doAction = (action: Action, sourceCell?: number, destinationCell?: string, comment?: string): string => {

    switch (action) {
        case Action.GROW:
        case Action.COMPLETE:
            return action + " " + sourceCell;
        case Action.SEED:
            return action + " " + sourceCell + " " + destinationCell;
        default:
            return action + " " + comment;
    }
}

export default doAction;