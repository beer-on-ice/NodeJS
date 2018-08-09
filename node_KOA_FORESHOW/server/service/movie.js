const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

export const fineAndRemove = async (id) => {
  const movie = await Movie.findOne({_id: id})
  if (movie) {
    await movie.remove()
  }
}

export const getAllMovies = async (type, year) => {
  let query = {}
  // $in  field只要和array中的任意一个value相同，那么该文档就会被检索出来。
  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }
  if (year) {
    query.year = year
  }
  const movies = await Movie.find(query)
  return movies
}

export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({_id: id})
  return movie
}

export const getRelativeMovies = async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })
  return movies
}
