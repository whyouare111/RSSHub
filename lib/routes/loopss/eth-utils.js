const Web3 = require('web3');

const netWorkExplorerMapping = {
    // Mainnet
    1: 'https://etherscan.io',
    // Kovan Test Network
    42: 'https://kovan.etherscan.io',
    // BSC
    56: 'https://bscscan.com',
    // xDAI
    100: 'https://blockscout.com/poa/xdai',
    // Truffle
    1337: 'http://127.0.0.1:7545'

};

const netWorkProviderMapping = {
    // Mainnet
    1: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    // Kovan Test Network
    42: `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    // BSC
    56: 'https://bsc-dataseed.binance.org',
    // xDAI
    100: 'https://rpc.xdaichain.com',
    // Truffle
    1337: 'http://127.0.0.1:7545'

};

module.exports = {
    getBlockExplorer: function (networkId) {
        return netWorkExplorerMapping[networkId];

    },
    getWeb3ProviderUrl: function(networkId) {
        return netWorkProviderMapping[networkId];
    },
    initWeb3: function(networkId) {
        return new Web3(this.getWeb3ProviderUrl(networkId));
    }
};
