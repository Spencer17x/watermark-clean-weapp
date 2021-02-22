// 云函数入口文件
const fs = require('fs');
const path = require('path');
const cloud = require('wx-server-sdk')
const axios = require('axios')
const { mySign } = require('./sign')

cloud.init()

const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const qsyBaseUrl = 'http://qsy.xiaofany.com';
const cityBaseUrl = 'https://pv.sohu.com';

async function request(object) {
  const { url, responseType, method = 'get', ...rest } = object;
	const option = {
		url,
		method,
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
    },
    ...rest
	};
	if (responseType) {
		option.responseType = responseType;
	}
	return axios(option);
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const { videoUrl } = event;

  // 获取去水印解析视频的token
  const tokenRes = await request({
    url: qsyBaseUrl + '/api/getToken',
    method: 'post'
  });
  const { token } = tokenRes.data.data;

  // 获取解析接口所需的returnCitySN
  const cityRes = await request({
    url: cityBaseUrl + '/cityjson?ie=utf-8',
  });
  const cityArr = cityRes.data.split(' ');
  const returnCitySN = {
    cip: cityArr[4].replace('"', '').replace('",', ''),
    cid: cityArr[6].replace('"', '').replace('",', ''),
    cname: cityArr[8].replace('"', '').replace('"};', '')
  };
  const t = new Date().getTime();
  const sign = mySign(videoUrl, t, token, returnCitySN);
  // 解析并去水印
  const videoRes = await request({
    url: qsyBaseUrl + '/api/analyze',
    data: {
      token,
      url: videoUrl,
      t,
      sign
    },
    method: 'post'
  });

  const { data: videoStream } = await request({
    url: videoRes.data.data.video,
    responseType: 'stream'
  });

  const now = Date.now();
  const fileWriteStream = fs.createWriteStream(path.join(__dirname, `./video/${now}.mp4`));
  await new Promise((resolve, reject) => {
    videoStream
    .pipe(fileWriteStream)
    .on("close", function (err) {
      if (err) {
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
  const fileStream = fs.createReadStream(path.join(__dirname, `./video/${now}.mp4`))
  const res = await cloud.uploadFile({
    fileContent: fileStream,
    cloudPath: `${now}.mp4`,
    config: {
      env: 'watermark-clean-6ghs16f9b4f0ff82'
    }
  });

  console.log('res', res)
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}