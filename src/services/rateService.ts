import { round } from '../helper/math';

const BASE_URL = 'https://api.ratesapi.io/api/latest';

// eslint-disable-next-line import/prefer-default-export
export const getRate = async (source: string, destination: string): Promise<number> => {
    const response = await fetch(`${BASE_URL}?base=${source}&symbols=${destination}`);

    if (!response.ok) {
        throw new Error(`Unable to get rates (response status: ${response.status})!`);
    }

    const data = await response.json();

    return round(data.rates[destination], 4);
};
