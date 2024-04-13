/**
 * Sleeps randomly between a given minimum and maximum of miliseconds
 * @param minMiliSec Minimum of miliseconds
 * @param maxMiliSec Maximum of miliseconds
 */
export const sleepRandomly = (minMiliSec: number, maxMiliSec: number) => {
  const randomMiliSec = Math.floor(Math.random() * (maxMiliSec - minMiliSec)) + minMiliSec;
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < randomMiliSec);
};
