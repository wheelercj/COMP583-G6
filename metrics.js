import pkg from 'chartjs-node-canvas';
const { ChartJSNodeCanvas } = pkg;

import { DB } from './db.js';
const db = new DB();


/*
    Returns an image if successful, otherwise returns null.
*/
export async function createGraph(urlId, dayCount) {
    const metrics = await fetchMetrics(urlId, dayCount);
    if (!metrics) {
        return null;
    }
    const { clickCounts, days } = metrics;
    const width = 400;
    const height = 400;
    const canvasRenderService = new ChartJSNodeCanvas({ width, height });
    const configuration = {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Clicks',
                data: clickCounts,
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
    Gets the clickthrough rates of the last dayCount days (including today) of a url
    from the database. Returns an object with attributes `clickCounts` and `days` (each
    an array) if successful, otherwise returns null.
*/
async function fetchMetrics(urlId, dayCount) {
    const results = await db.selectMetrics(urlId, dayCount);
    let clickCounts = [];
    let days = [];
    for (let i = 0; i < results.length; i++) {
        clickCounts.push(results[i]['clicks']);
        days.push(results[i]['date']);
    }
    if (clickCounts.length > 0) {
        for (let i = 0; i < days.length; i++) {
            days[i] = datetimeToDay(days[i]);
        }
        clickCounts = clickCounts.reverse();
        days = days.reverse();
        return { clickCounts: clickCounts, days: days };
    }
    return null;
}


const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function datetimeToDay(datetime) {
    return weekDays[new Date(datetime).getDay()];
}
