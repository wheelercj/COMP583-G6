import pkg from 'chartjs-node-canvas';
const { ChartJSNodeCanvas } = pkg;

import { DB } from './db.js';
const db = new DB();


/*
    Returns an image if successful, otherwise returns null.

    Sample inputs:
        dailyClickCounts = [378, 132, 538, 428];
        dayNames = ["Tuesday", "Wednesday", "Thursday", "Friday"];
*/
export async function createGraph(dailyClickCounts, dayNames) {
    const width = 400;
    const height = 400;
    const canvasRenderService = new ChartJSNodeCanvas({ width, height });
    const configuration = {
        type: 'line',
        data: {
            labels: dayNames,
            datasets: [{
                label: 'Clicks',
                data: dailyClickCounts,
                backgroundColor: 'white',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
    return await canvasRenderService.renderToBuffer(configuration);
}

/*
    Gets from the database a link's metrics from the last maxDays days (including
    today). Requires either urlId or shortUrl. If both are given, uses urlId. If
    unsuccessful, returns null.

    Sample return value:
        {
            locations: [
                {
                    region: "California",
                    country: "United States",
                    percent: 0.8846153846153846,
                },
                {
                    region: "Quebec",
                    country: "Canada",
                    percent: 0.11538461538461539,
                },
            ],
            clicks: {
                // these arrays are parallel
                dayNames: [
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                ],
                dailyTotalCounts: [
                    378,
                    132,
                    538,
                    428,
                ],
                dailyUniqueCounts: [  // unique per day, but not necessarily unique overall
                    345,
                    127,
                    512,
                    394,
                ],
                uniqueCount: 1253,  // unique overall
            }
        }
*/
export async function fetchMetrics(urlId, shortUrl, maxDays) {
    let results;
    if (urlId !== undefined) {
        results = await db.selectClicks(urlId, maxDays);
    } else if (shortUrl !== undefined) {
        results = await db.selectClicksByShortUrl(shortUrl, maxDays);
    } else {
        throw new Error("urlId and shortUrl cannot both be undefined.");
    }
    if (results.length === 0) {
        return null;
    }

    let datetimes = [];
    let ips = [];
    for (let i = 0; i < results.length; i++) {
        datetimes.push(results[i]['created']);
        ips.push(results[i]['ip']);
    }

    const locations = await getLocations(ips);
    const clicks = await getClicks(datetimes, ips);
    return { locations: locations, clicks: clicks };
}


/*
    Sample return value:
        [
            {
                region: "California",
                country: "United States",
                percent: 0.8846153846153846,
            },
            {
                region: "Quebec",
                country: "Canada",
                percent: 0.11538461538461539,
            },
        ]
*/
async function getLocations(ips) {
    let locations = [];
    for (let i = 0; i < ips.length; i++) {
        locations.push(await ipToLocation(ips[i]));
    }
    let uniqueLocations = [];
    let uniqueLocationCounts = [];
    for (let i = 0; i < locations.length; i++) {
        let j = indexOfLocation(locations[i], uniqueLocations);
        if (j === -1) {
            uniqueLocations.push(locations[i]);
            uniqueLocationCounts.push(1);
        } else {
            uniqueLocationCounts[j]++;
        }
    }
    for (let i = 0; i < uniqueLocations.length; i++) {
        uniqueLocations[i].percent = uniqueLocationCounts[i] / locations.length;
    }
    return uniqueLocations;
}


function indexOfLocation(location, locations) {
    for (let i = 0; i < locations.length; i++) {
        if (location.region === locations[i].region && location.country === locations[i].country) {
            return i;
        }
    }
    return -1;
}


/*
    Converts an IP address to an approximate geographic location.

    Sample return value:
        {
            region: "California",
            country: "United States",
            percent: undefined,  // this is always undefined here
        }
*/
async function ipToLocation(ip) {
    if (ip === "::ffff:127.0.0.1") {
        return { region: "Localhost", country: "Localhost", percent: undefined };
    }
    const response = await fetch("http://ip-api.com/json/" + ip);
    const json = await response.json();
    return { region: json['regionName'], country: json['country'], percent: undefined };
}


/*
    Counts unique and total clicks per day. The `datetimes` and `ips` arrays must be
    parallel and can have multiple values per day.

    Sample return value:
        {
            // these arrays are parallel
            dayNames: [
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
            ],
            dailyTotalCounts: [
                378,
                132,
                538,
                428,
            ],
            dailyUniqueCounts: [  // unique per day, but not necessarily unique overall
                345,
                127,
                512,
                394,
            ],
            uniqueCount: 1253,  // unique overall
        }
*/
async function getClicks(datetimes, ips) {
    let dayNames = [];
    let dailyTotalCounts = [];
    let dailyUniqueCounts = [];

    // Convert datetime strings to day strings.
    for (let i = 0; i < datetimes.length; i++) {
        dayNames[i] = datetimeToDayName(datetimes[i]);
    }
    dayNames = [...new Set(dayNames)];  // remove duplicates

    // Count clicks per day.
    let j = 0;
    for (let i = 0; i < dayNames.length; i++) {
        let totalClicksThisDay = 0;
        let uniqueClicksThisDay = 0;
        let dayStart = j;
        for (; j < datetimes.length; j++) {
            if (dayNames[i] === datetimeToDayName(datetimes[j])) {
                totalClicksThisDay++;
                if (ips.indexOf(ips[j], dayStart) === j) {
                    uniqueClicksThisDay++;
                }
            } else {
                break;
            }
        }
        dailyTotalCounts[i] = totalClicksThisDay;
        dailyUniqueCounts[i] = uniqueClicksThisDay;
    }

    return {
        dayNames: dayNames,
        dailyTotalCounts: dailyTotalCounts,
        dailyUniqueCounts: dailyUniqueCounts,
        uniqueCount: [...new Set(ips)].length
    };
}


const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


/*
    Converts a datetime string to a day string.
*/
function datetimeToDayName(datetime) {
    return dayNames[new Date(datetime).getDay()];
}
