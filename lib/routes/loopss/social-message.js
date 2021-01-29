const abi = require('./abi');
const ethUtils = require('./eth-utils');
const loopssUtils = require('./loopss-utils');

/**
 * 网络映射关系
 *
 * <p>不同网络的智能合约地址可能不同</p>
 */
const { loopssNetworkMapping } = loopssUtils;

module.exports = async (ctx) => {
    const networkId = ctx.params.networkId;
    const loopssParam = loopssNetworkMapping[networkId];
    const loopssAddress = loopssParam.address;
    const web3 = ethUtils.initWeb3(networkId);
    const LoopssContract = new web3.eth.Contract(abi, loopssAddress);

    const filter = {};

    let sendFlag = false;
    if (ctx.params.sender && ctx.params.sender.length == 42) {
        filter.Sender = ctx.params.sender;
        sendFlag = true;
    }

    let receiveFlag = false;
    if (ctx.params.receiver && ctx.params.receiver.length == 42) {
        filter.Receiver = ctx.params.receiver;
        receiveFlag = true;
    }

    if (ctx.params.channel && parseInt(ctx.params.channel) >= 0) {
        filter.Channel = ctx.params.channel;
    }

    let fromBlock = 0;
    if (ctx.params.fromBlock) {
        fromBlock = parseInt(ctx.params.fromBlock);
    }

    const params = {
        filter: filter,
        fromBlock: fromBlock
    };

    const socialMessages = await LoopssContract.getPastEvents('SocialMessage', params);

    let edge = '';
    if (sendFlag) {
        edge += `From ${filter.Sender} `;
    }
    if (receiveFlag) {
        edge += `To ${filter.Receiver}`;
    }

    ctx.state.data = {
        title: `Loopss Social Message@${loopssParam.network} ${edge} ${filter.Channel !== undefined ? ':' + filter.Channel : ''}`,
        link: `http://www.loopss.me`,
        allowEmpty: true,
        item: socialMessages.map(
            async (socialMessage) => {
                const block = await web3.eth.getBlock(socialMessage.blockNumber);
                return {
                    title: socialMessage.returnValues.Title,
                    description: socialMessage.returnValues.Content,
                    link: ethUtils.getBlockExplorer(networkId) + '/tx/' + socialMessage.transactionHash,
                    author: socialMessage.returnValues.Sender,
                    pubDate: block.timestamp
                };
            }
        )
    };
};
