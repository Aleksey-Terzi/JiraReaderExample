export function convertSecondsToTime(seconds: number) {
    const sign = seconds < 0 ? "-" : "";

    if (seconds < 0) {
        seconds = -seconds;
    }

    const minutesTotal = Math.ceil(seconds / 60);
    const hoursTotal = Math.floor(minutesTotal / 60);
    const days = Math.floor(hoursTotal / 8);
    const hours = hoursTotal % 8;
    const minutes = minutesTotal % 60;

    return `${sign}${days.toString().padStart(2, "0")}.${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}