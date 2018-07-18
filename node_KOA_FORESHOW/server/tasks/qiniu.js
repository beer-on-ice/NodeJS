const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        if (info.statusCode === 200) {
          resolve({key})
        } else {
          reject(info)
        }
      }
    })
  })
}

;(async () => {
  let movies = [
    {
      video: 'http://vt1.doubanio.com/201807181602/4d1e2a67c95ea99419f96595db9c61df/view/movie/M/402330091.mp4',
      doubanId: '26366496',
      cover: 'https://img3.doubanio.com/img/trailer/medium/2526489612.jpg?',
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526297221.jpg'
    }
  ]
  movies.map(async movie => {
    if (movie.video && !movie.key) {
      try {
        console.log('开始上传 video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        console.log('开始上传 cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
        console.log('开始上传 poster')
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')
        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
        console.log(movie)
      } catch (err) {
        console.log(err)
      }
    }
  })
})()
