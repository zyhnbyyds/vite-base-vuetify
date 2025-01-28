import { doGetUserInfo } from '@/apis/user.api'
import { useAuthStore } from '@/store/auth'
import { socketInitAfterLogin } from '@/utils/socket'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { getToken, removeToken } from '../utils/request'

const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
]

export const dynamicRoutes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home/index.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
  },
]

export const staticRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../views/NotFound.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...constantRoutes,
    ...dynamicRoutes,
    ...staticRoutes,
  ],
})

router.beforeEach(async (to, from, next) => {
  const { userInfo } = storeToRefs(useAuthStore())
  const token = getToken()
  if (to.name) {
    if (!router.hasRoute(to.name)) {
      next({ name: 'notFound' })
      return
    }
  }
  if (to.path !== '/login' && !token) {
    next({ name: 'login' })
    return
  }

  if (token) {
    if (to.name === 'login' && from.name !== 'login') {
      removeToken()
      next()
    }

    if (userInfo.value) {
      if (to.name === 'profile') {
        next('/')
      }
      else {
        next()
      }
    }
    else {
      // TODO: show global loading
      try {
        const { data } = await doGetUserInfo()

        if (data && data.user) {
          socketInitAfterLogin(data.user)
          userInfo.value = data.user
          if (to.name === 'profile') {
            next('/')
          }
          else {
            next()
          }
        }
        else if (data && data.registerUser) {
          socketInitAfterLogin(data.registerUser)
          if (to.name !== 'profile') {
            next('/profile')
          }
          else {
            next()
          }
        }
        else {
          removeToken()
          next('/login')
        }
      }

      catch (error) {
        console.log(error)
        next('/login')
      }
    }
  }
  else {
    next()
  }
})
