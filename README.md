`docker compose up -d` to start influxdb and grafana containers

- InfluxDB at [`localhost:8086`](localhost:8086)
- Grafana at [`localhost:3000`](localhost:3000)

`tsc -w -p .` starts a process to watch for typescript changes and compile them automatically

Load data with `node build/load-data.js`

## Settings

Make a copy of `.env-example` named `.env`.  This is used by docker compose (see references in `compose.yml`).

Make a copy of `env-example.ts` named `env.ts`.  This is used in the Typescript file for loading CSV data into InfluxDB (see references in `load-data.ts`).

## InfluxDB API token

Grafana and NodeJS require an API token from InfluxDB in order to access the Influx bucket.  Do this via the locally running influx

## Raw CSV files

Suffix meanings (presumably):

- `P` - powered (but engine never run)
- `E` - engine run (but never in flight)
- `F` - flight

## Data cleanup

1. find files whose column heading row ends with ",Latitude,Longitude"
   - datasets with this heading seem to not include values for them, thus invalidating the CSV records
   - remove Longitude from the heading row to correct
   - `awk -i inplace -v INPLACE_SUFFIX=.bak '{sub(/,Longitude/,"")sub(/,Latitude/,"")}1' fltlog/*.csv`
   - `awk -i inplace -v INPLACE_SUFFIX=.bak '{sub(/,Dist to Dest/,",Dist to Dest,")}1' fltlog/*.csv`

2. manually remove records like "TOTAL   : 0.00,ERR,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,COM,N/A,N/A,N/A,N/A,N/A,COM,N/A,N/A,N/A,N/A,N/A,N/A,COM,"
   - generally the entire file is like this, in those cases just delete the entire file

3. manually remove incomplete records (e.g., partial records at the end of a file)



## Reference

- https://docs.influxdata.com/influxdb/cloud/api-guide/client-libraries/nodejs/install/
- https://docs.influxdata.com/influxdb/cloud/api-guide/client-libraries/nodejs/install/