//////////////////////////////////////
///Helper Functions///////////////////
//////////////////////////////////////

export const timeToString = (timeSec) => {
  return `${Math.floor(timeSec / 3600)
    .toString()
    .padStart(2, "0")}:${(Math.floor(timeSec / 60) % 60)
    .toString()
    .padStart(2, "0")}:${(timeSec % 60).toString().padStart(2, "0")}`;
}

export const dateToString = (rawDate) => new Date(rawDate).toISOString().slice(0, 10);

export const timeAgo = (date) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes";
  return Math.floor(seconds) + " seconds";
};

// module.exports = {
//   timeToString,
//   dateToString,
//   timeAgo,
// };
