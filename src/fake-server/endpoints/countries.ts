/* eslint-disable import/prefer-default-export */

// application
import { clone } from '~/fake-server/utils';
import { ICountry } from '~/interfaces/country';

const countries: ICountry[] = [
    { code: 'TH', name: 'Thailand' },
];

export function getCountries(): Promise<ICountry[]> {
    return Promise.resolve(clone(countries));
}
