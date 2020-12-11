export const GetCityAndStreetname = async (
    lat: number,
    lng: number,
): Promise<{
    streetName: string;
    city: string;
} | null> => {
    const string =
        'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
        lat +
        ',' +
        lng +
        '&sensor=true&key=' +
        'api-key';

    try {
        const response = await axios.get(string);

        const result = response.data.results;

        if (!result) {
            return null;
        }

        let streetName = '';
        let city = '';

        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].types.length; j++) {
                if (result[i].types[j] == 'postal_town') {
                    city = result[i].formatted_address;
                }
                if (result[i].types[j] == 'street_address') {
                    streetName = result[i].formatted_address;
                }
            }
        }

        if (city.includes(',')) {
            city = city.substring(0, city.indexOf(','));
        }

        if (streetName.includes(',')) {
            streetName = streetName.substring(0, streetName.indexOf(','));
        }

        return {
            streetName,
            city,
        };
    } catch (exception) {
        Logger.Log(
            `GetCityAndStreetname: ${
                exception.response.status
            }, url: {${string}} e: ${JSON.stringify(exception.response)}`,
            4,
        );
        return null;
    }
};
