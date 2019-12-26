type RoundFunction = (value: number) => number;

const createRoundFunction = (roundFunction: RoundFunction) =>
    (value: number, precision = 2): number => {
        const base = 10 ** precision;

        return roundFunction(value * base) / base;
    };

export const round = createRoundFunction(Math.round.bind(Math));

export const floor = createRoundFunction(Math.floor.bind(Math));
