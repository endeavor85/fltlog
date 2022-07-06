import { url, token, org, bucket, measurementName } from './env'

import { InfluxDB, Point, HttpError, WriteApi } from '@influxdata/influxdb-client'

import { readdirSync, createReadStream } from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { parse as csvParse } from 'csv-parse';

import { FieldType, fieldTypeLookup } from './field-types';

// create a write API, use millisecond precision
const influxWriteApi: WriteApi = new InfluxDB({ url, token }).getWriteApi(org, bucket, 'ms');

// setup default tags for all writes through this API
influxWriteApi.useDefaultTags({});

class FltLogHeader {
    aircraftId: string = '';
    flightNumber: string = '';
    date: Date = new Date(0);
}

// const input_dir = path.join('fltlog');
const input_dir = path.join('fltlog');

async function processFltLogs(fltlogDir: string) {
    let logFiles: string[] = [];

    try {
        // get log file listing
        let files = readdirSync(input_dir);
        logFiles = files
            .filter((f) => path.extname(f) === '.csv')
            .map((f) => path.join(input_dir, f));
    }
    catch (err) {
        console.error(`Error listing log files from input directory '${input_dir}'`, err);
    }

    const fileProcessPromises: Promise<any>[] = [];

    for (const file of logFiles) {
        fileProcessPromises.push(
            readHeaderInfo(file).then((header: FltLogHeader) => {
                return new Promise<void>((resolve, reject) => {
                    createReadStream(file)
                        .pipe(csvParse({ delimiter: ",", from_line: 15, columns: true, skip_records_with_error: true }))
                        .on("data", (row) => {
                            const recordTimestamp: Date | null = createRecordTimestamp(header.date, row['ZULU;H:M:S']);
                            if (recordTimestamp) {
                                const point = new Point(measurementName)
                                    .timestamp(recordTimestamp)
                                    .tag('aircraftId', header.aircraftId)
                                    .tag('FlightNum', header.flightNumber);
                                for (const key of Object.keys(row)) {
                                    switch (fieldTypeLookup.get(key)) {
                                        case FieldType.float:
                                            point.floatField(key, row[key]);
                                            break;
                                        case FieldType.int:
                                            point.intField(key, row[key]);
                                            break;
                                        case FieldType.uint:
                                            point.uintField(key, row[key]);
                                            break;
                                        case FieldType.boolean:
                                            point.booleanField(key, row[key]);
                                            break;
                                        case FieldType.string:
                                        default:
                                            point.stringField(key, row[key]);
                                            break;
                                    };
                                }
                                influxWriteApi.writePoint(point);
                                // console.log(` ${point}`);
                                console.log(`Wrote point: ${point}`);
                            }
                            else {
                                console.warn(`Invalid record timestamp: ${row['ZULU;H:M:S']}`);
                            }

                            // console.log(row);
                        })
                        .on('error', (err) => {
                            console.error(err);
                            reject(err);
                        })
                        .on("skip", (err) => {
                            if (/^Invalid Record Length: columns length is 60, got 59/.test(err.message)) {
                                console.warn(`Skipping erroneous record: ${file}\nTry removing Latitude and Longitude columns from heading row in CSV data file`);
                                // console.warn(`Skipping erroneous record: ${file}\nTry removing Latitude and Longitude columns from heading row in CSV data file`, err);
                            }
                            else {
                                console.warn(`Skipping erroneous record: ${file}`, err);
                            }
                        })
                        .on('end', () => {
                            console.log(`Finished processing file: ${file}`);
                            resolve();
                        });
                });
            })
        );
    }

    console.log("files: " + fileProcessPromises.length);

    // wait for all files to process, then flush data and close InfluxDB WriteAPI
    await Promise.all(fileProcessPromises).then(() => {
        console.log("CLOSING NOW");
        // WriteApi always buffer data into batches to optimize data transfer to InfluxDB server.
        // writeApi.flush() can be called to flush the buffered data. The data is always written
        // asynchronously, Moreover, a failed write (caused by a temporary networking or server failure)
        // is retried automatically. Read `writeAdvanced.js` for better explanation and details.
        //
        // close() flushes the remaining buffered data and then cancels pending retries.
        influxWriteApi
            .close()
            .then(() => {
                console.log('Closed Influx WriteApi');
            })
            .catch(e => {
                console.error(e)
                if (e instanceof HttpError && e.statusCode === 401) {
                    console.log('401 Error, unknown database - create database first.');
                }
                console.log('\nFinished ERROR');
            });
    });
}

function readHeaderInfo(file: string): Promise<FltLogHeader> {
    console.log(`Processing: ${file}`);

    return new Promise((resolve, reject) => {
        var result: FltLogHeader = new FltLogHeader();
        var rl = readline.createInterface({
            input: createReadStream(file)
        });

        var lineCounter = 0;
        rl.on('line', function (line) {
            switch (++lineCounter) {
                case 3:
                    result.aircraftId = line.replace(/^Aircraft ID\: /g, '').trim();
                    break;
                case 9:
                    result.date = parseDateHeader(line);
                    break;
                case 10:
                    result.flightNumber = line.replace(/^Flight Number\: /g, '').trim();
                    rl.close(); // stop after reading flight number
                    break;
            }
        });

        rl.on('close', () => {
            resolve(result);
        });
    });
}

function parseDateHeader(dateLine: string): Date {
    return new Date(
        Date.parse(
            dateLine                            // "Zulu Time.: 2019/09/23 11:01:45 "
                .trim()                           // "Zulu Time.: 2019/09/23 11:01:45"
                .replace(/^Zulu Time.\: /g, '')   // "2019/09/23 11:01:45"
                .replace(/\//g, '-')              // "2019-09-23 11:01:45"
                .replace(/ /g, 'T')               // "2019-09-23T11:01:45"
                .concat(".000Z")                  // "2019-09-23T11:01:45.000Z"
        )
    );
}

function createRecordTimestamp(logZuluDate: Date, zuluHMS: string): Date | null {
    //'ZULU;H:M:S': '18:02:56'
    // rowZuluTime only comes with time, not date, so we use the date value of logZuluDate
    // TODO: handle midnight rollover

    // copy logZuluDate into timestamp

    let matchResult: RegExpMatchArray | null = zuluHMS.match(/^([0-2][0-9])\:([0-5][0-9])\:([0-5][0-9])$/);
    if (matchResult) {
        let timestamp: Date = new Date(logZuluDate.getTime());
        timestamp.setHours(Number(matchResult[1]), Number(matchResult[2]), Number(matchResult[3]));
        return timestamp;
    }
    else {
        return null;
    }
}

processFltLogs(input_dir);
