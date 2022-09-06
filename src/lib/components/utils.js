
export const getLiveRate = async (symbol) => {
  var liveRate;
  if (symbol === 'LOLO') {
    liveRate = 0.01
  } else {
    const response = await (
      await fetch(`https://api.coingecko.com/api/v3/search?query=${symbol}`)
    ).json();

    const getVal = await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${response["coins"][0].id}&vs_currencies=usd`
      )
    ).json();

    liveRate = symbol === "GLL" ? 0.01 : getVal[response["coins"][0].id].usd
  }
  return liveRate;
};


