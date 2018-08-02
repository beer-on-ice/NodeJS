import AC from './components/async_load'
export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    compnent: AC(() =>
      import ('./views/home/index'))
  },
  {
    name: '详情页',
    path: '/detail/:id',
    compnent: AC(() =>
      import ('./views/movie/detail'))
  }
]
