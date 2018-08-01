const rp = require('request-promise-native')
const baseUrl = 'http://api.douban.com/v2/movie/'
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

// 获取电影详细信息
async function fetchMovie (item) {
  const url = `${baseUrl}${item.doubanId}`
  const res = await rp(url)
  let body
  try {
    body = JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
  return body
}

;(async () => {
  // 操作在一个数据或者多个表达式并且需要选择至少一个满足条件的表达式
  let movies = await Movie.find({
    $or: [
      {summary: {$exists: false}},
      {year: {$exists: false}},
      {summary: null},
      {title: ''},
      {summary: ''}
    ]
  })

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]

    let movieData = await fetchMovie(movie)
    if (movieData) {
      let tags = movieData.tags || []
      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        // 处理分类
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500
        for (let i = 0; i < movie.movieTypes.length; i++) {
          let item = movie.movieTypes[i]
          let cat = await Category.findOne({
            name: item
          })
          // 没有就创建新分类名
          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            // 有该分类就存入该电影
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          // 当前电影的分类里加入该分类ObjectId
          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }
        // 日期，地点处理
        let dates = movieData.attrs.pubdate || []
        let pubdates = []
        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'
            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })
        movie.pubdate = pubdates
      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      await movie.save()
    }
  }
})()
