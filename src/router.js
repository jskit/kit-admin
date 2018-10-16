import Vue from 'vue';
import Router from 'vue-router';
import env from '@/config/env';
import Index from '@/views/Index.vue';
// import PageError from '@/views/Error.vue';

console.warn('router.js');
Vue.use(Router);

function lazyLoad(page) {
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  // import(/* webpackChunkName: "`${chunkName}`" */ `@/views/${page}`);
  // 这里不能传 'views/About', 可以使用 [request]-[index]
  // /* webpackChunkName: "[request]-[index]" */
  if (env.isMode('prod')) {
    return () =>
      import(/* webpackChunkName: "msf-[index]" */ `@/views/${page}`);
  }
  return () =>
    import(/* webpackChunkName: "[request]-[index]" */ `@/views/${page}`);
}

const routes = [
  {
    path: '*',
    name: 'Error_404',
    meta: {},
    component: lazyLoad('common/404'),
  },
];

if (!env.isEnv('prod')) {
  routes.unshift({
    path: '/bridge',
    name: 'bridge',
    meta: { title: 'JSBridge 调试' },
    component: lazyLoad('common/Bridge'),
  });
  routes.unshift({
    path: '/debug',
    name: 'debug',
    meta: { title: 'Debug 调试页面', needAuth: false },
    component: lazyLoad('common/Debug'),
  });
}

const demoRoutes = [
  {
    path: '/demo',
    name: 'demo',
    meta: { title: 'demo 标题', needAuth: false },
    component: lazyLoad('component-demo/Demo'),
    children: [
      {
        path: 'header',
        name: 'header',
        meta: { title: 'header 标题', needAuth: false },
        component: lazyLoad('component-demo/Header'),
      },
      {
        path: 'search',
        name: 'search',
        meta: { title: 'search 标题', needAuth: false },
        component: lazyLoad('component-demo/Search'),
      },
      {
        path: 'scroll',
        name: 'scroll',
        meta: { title: 'scroll 标题', needAuth: false },
        component: lazyLoad('component-demo/Scroll'),
      },
      {
        path: 'testheader',
        name: 'testheader',
        meta: {},
        component: lazyLoad('component-demo/testHeader'),
      },
    ],
  },
];

const router = new Router({
  // debug: __DEV__ ? env.debug : false,
  mode: env.routerMode,
  base: env.routerBase,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // },
  routes: [
    {
      path: '/',
      alias: '/index',
      name: 'index',
      meta: { needAuth: false, keepAlive: true, title: '觅食峰' },
      component: Index,
    },
    {
      path: '/city',
      name: 'city',
      meta: { title: '城市选择' },
      component: lazyLoad('City'),
    },
    {
      path: '/shop',
      name: 'shop',
      meta: { title: '探店' },
      component: lazyLoad('Shop'),
    },
    {
      path: '/shopdetail',
      name: 'shopdetail',
      meta: { title: '店铺详情' },
      component: lazyLoad('ShopDetail'),
    },
    {
      path: '/shopsearch',
      name: 'shopsearch',
      meta: { title: '商圈搜索' },
      component: lazyLoad('ShopSearch'),
    },
    {
      path: '/map',
      name: 'map',
      meta: { title: '地图' },
      component: lazyLoad('Map'),
    },
    {
      path: '/searcharticle',
      name: 'searcharticle',
      meta: { needAuth: false, title: '文章搜索' },
      component: lazyLoad('SearchArticle'),
    },
    {
      path: '/home',
      name: 'home',
      meta: { needAuth: false },
      component: lazyLoad('Home'),
    },
    {
      path: '/publish',
      name: 'publish',
      redirect: '/download',
      meta: { title: '分享美食体验', needAuth: true },
      component: lazyLoad('Publish'),
    },
    {
      path: '/about',
      name: 'about',
      meta: { index: 1, title: '关于我们' },
      component: lazyLoad('About'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { index: 10, title: '登录' },
      component: lazyLoad('Login'),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: { title: '我的', needAuth: true },
      component: lazyLoad('Profile'),
    },
    {
      path: '/message',
      name: 'message',
      meta: { title: '消息', needAuth: true },
      component: lazyLoad('Message'),
    },
    {
      path: '/follow',
      name: 'follow',
      meta: { title: '' },
      component: lazyLoad('Follow'),
    },
    {
      path: '/comments',
      name: 'comments',
      meta: { title: '全部评论' },
      component: lazyLoad('Comments'),
    },
    {
      path: '/setting',
      name: 'setting',
      meta: { title: '账户设置', needAuth: true },
      component: lazyLoad('Setting'),
    },
    {
      path: '/article',
      name: 'article',
      meta: { title: '' },
      component: lazyLoad('Article'),
    },
    {
      path: '/setup',
      name: 'setup',
      meta: { title: '修改昵称' },
      component: lazyLoad('SetUp'),
    },
    {
      path: '/rule',
      name: 'rule',
      meta: { title: '' },
      component: lazyLoad('Rule'),
    },
    {
      path: '/download',
      name: 'download',
      meta: { title: '' },
      component: lazyLoad('Download'),
    },
    ...demoRoutes,
    ...routes,
  ],
});

export default router;
