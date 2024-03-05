import axios from 'axios';
import { axiosConfig } from '@moncici/proxy';
import { sleep } from '@moncici/sleep';
import { notify } from 'feishu-notifier';

export async function getPriceByCoin(coin) {
  const url = 'https://api.coingecko.com/api/v3/coins/'+coin;
  sleep(1000);
  try {
    const response = await axios.get(url, axiosConfig);
    const data = response.data;
    log(`${coin} 实时价格：${data.market_data.current_price.usd}`);
    return data.market_data.current_price.usd;
  } catch(error) {
    notify('BUY', error.response.data);
    error(`无法获取 ${coin} USD 价格:`, error.response.data);
    throw error; // 将错误向上抛出
  }
}

export async function getCoins() {
  const url = `https://api.coingecko.com/api/v3/coins/list?include_platform=true`;

  try {
    const response = await axios.get(url, axiosConfig);
    // log(response)
    const data = response.data;

    let addresses = data.reduce((acc, item) => {
      let platformAddresses = Object.values(item.platforms);
      let filteredArray = platformAddresses.filter(item => item && item.trim() !== '');
        // Use the spread operator to concatenate arrays
      return acc.concat(filteredArray);
    }, []); // Provide an initial value for the accumulator (an empty array)
    // log(addresses.length, addresses.slice(0, 10));
    return addresses;

  } catch(error) {
    log(`无法获取coins: `, error);
    throw error; // 将错误向上抛出
  }
}
