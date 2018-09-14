<<<<<<< HEAD
import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import {routers} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
=======
import Vue from 'vue'
import Router from 'vue-router'
import index from '@/page/index'
import homeView from '@/page/home'
import blocksView from '@/page/blocks'
import blocksInfoView from '@/page/blocksInfo'
import transactionsView from '@/page/transactions'
import transactionsInfoView from '@/page/transactionsInfo'
import accountsView from '@/page/accounts'
import accountsInfoView from '@/page/accountsInfo'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      meta: {title: ''},
      redirect:"home",
      children: [
        {
        path: '/home',
        component: homeView,
      }
        ,{
          path: '/blocks',
          component: blocksView,
          meta: {title:[{"link":"home","text":'home'},{"link":"blocks","text":'blocks'}]},
        }
        ,{
          path: '/blocks/blocksInfo',
          component: blocksInfoView,
          meta: {title: [{"link":"home","text":'home'},{"link":"blocks","text":'blocks'},{"link":"/blocks/blocksInfo","text":'block info'}]},
        }
        ,{
          path: '/transactions',
          component: transactionsView,
          meta: {title: [{"link":"home","text":'home'},{"link":"transactions","text":'transactions'}]},
        }
        ,{
          path: '/transactions/transactionsInfo',
          component: transactionsInfoView,
          meta: {title: [{"link":"home","text":'home'},{"link":"transactions","text":'transactions'},{"link":"/transactions/transactionsInfo","text":'transaction info'}]},
        }
        ,{
          path: '/accounts',
          component: accountsView,
          meta: {title: [{"link":"home","text":'home'},{"link":"accounts","text":'accounts'}]},
        }
        ,{
          path: '/accounts/accountsInfo',
          component: accountsInfoView,
          meta: {title:[{"link":"home","text":'home'},{"link":"accounts","text":'accounts'},{"link":"/accounts/accountsInfo","text":'account info'}]},
        }
      ]
    }

  ]
})
>>>>>>> 6f119ba70fdcf9e1323186b1bb352adaf497b22c
