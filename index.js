import fetch from 'node-fetch';

const validatorKey = process.env.VALIDATOR_KEY;

const url = `https://holesky.beaconcha.in/api/v1/validator/${validatorKey}`;

const fetchWithTimeout = (url, options, timeout = 15000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Request timed out'));
        }, timeout);

        fetch(url, options)
            .then(response => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
};

const fetchData = async (url, retries = 3, timeout = 10000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetchWithTimeout(url, {}, timeout);
            if (!response.ok || !response.status == "OK") {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) {
                console.error('All attempts failed');
                throw error;
            }
        }
    }
};

fetchData(url)
    .then(data => console.log('Data fetched successfully'))
    .catch(error => console.error('Final error:', error));
