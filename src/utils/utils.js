export const groupByPosition = (players) => {
  return players.reduce(
    (accum, current) => {
      (accum[current.position] = accum[current.position] || []).push(current);
      return accum;
    }, 
    {}
  )
}