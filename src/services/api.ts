/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// should be env variables.
const test = 'https://cueapp.se/test/';
const stage = 'https://cueapp.se/stage/';
const local = 'http://localhost:9100/dev/';
const prod = 'http://localhost:9100/prod/';

export type ErrorMessage =
    | 'ERR_LIMIT_REACHED'
    | 'ER_MISSING_PARAMS'
    | 'ERR_INTERNAL_ERROR';

export const post = (path: string, body: string): Promise<Response> => {
    return fetch(stage + path, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body,
    });
};
