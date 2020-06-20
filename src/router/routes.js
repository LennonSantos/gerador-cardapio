
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'splash' },
    children: [
      {
        path: 'splash',
        component: () => import('pages/Splash.vue'),
        name: 'splash'
      },
      {
        path: 'index',
        component: () => import('pages/Index.vue'),
        name: 'app/index'
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
