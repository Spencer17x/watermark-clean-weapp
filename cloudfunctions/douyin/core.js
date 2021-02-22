const axios = require('axios');
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
async function request(url, type) {
	const option = {
		url,
		method: 'get',
		headers: {
			'user-agent': userAgent,
			'authority': 'v.douyin.com',
			'pragma': 'no-cache',
			'cache-control': 'no-cache',
			'upgrade-insecure-requests': '1',
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			'sec-fetch-site': 'none',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-user': '?1',
			'sec-fetch-dest': 'document',
			'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
		}
	};
	if (type) {
		option.responseType = type;
	}
	return axios(option);
}


async function runDouyin(shareUrl) {
	const response = await request(shareUrl);
	const { responseUrl } = response.request.res;
	const id = responseUrl.match(/\/video\/[0-9]*/)[0].replace('/video/', '');
	const videoRes = await request(`https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${id}`);
	const noWatermarkVideoUrl = videoRes.data.item_list[0].video.play_addr.url_list[0].replace('playwm', 'play');
	const shareTitle = videoRes.data.item_list[0].share_info.share_title;
	// const { data: videoStream } = await request(noWatermarkVideoUrl, 'stream');
	return { noWatermarkVideoUrl, shareTitle };
}

module.exports = {
	runDouyin
};