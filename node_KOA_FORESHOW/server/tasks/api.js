const rp = require('request-promise-native')
const baseUrl = 'http://api.douban.com/v2/movie/subject/'
async function fetchMovie (item) {
  const url = `${baseUrl}${item.doubanId}`
  const res = await rp(url)
  return res
}

;(async () => {
  let movies = [
    {
      doubanId: 27059183,
      title: '阳光先生',
      rate: 8.1,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526126803.jpg'
    },
    {
      doubanId: 30175310,
      title: '幸色的一居室',
      rate: 7.1,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2523410936.jpg'
    }
  ]
  movies.map(async movie => {
    let movieData = await fetchMovie(movie)
    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.original_title, movieData.summary)
    } catch (err) {
      console.log(err)
    }
  })
})()
