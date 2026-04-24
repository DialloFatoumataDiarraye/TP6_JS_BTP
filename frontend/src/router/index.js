import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import KanbanView from '../views/KanbanView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/kanban/:id',
      name: 'kanban',
      component: KanbanView
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: TaskDetailView
    }
  ]
})

export default router
