import { toZonedTime, format } from "date-fns-tz";

/**
 * Converts timestamps in a given data structure to a specified timezone.
 * 
 * @param data - The input data, which can be a Date, an array, or an object.
 * @param timeZone - The IANA timezone string to convert to.
 * @returns The converted data structure with timestamps formatted to the specified timezone.
 */
export function convertTimestampsToTimezone(data: any, timeZone: string): any {
    if (data instanceof Date) {
        const zonedDate = toZonedTime(data, timeZone);
        return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
    } else if (Array.isArray(data)) {
        return data.map(item => convertTimestampsToTimezone(item, timeZone));
    } else if (typeof data === "object" && data !== null) {
        const convertedObj: any = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                convertedObj[key] = convertTimestampsToTimezone(data[key], timeZone);
            }
        }
        return convertedObj;
    } else {
        return data; // Return unchanged data if it's neither a Date, Array, nor Object
    }
}
