<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import KanbanColumn from '../components/KanbanColumn.vue'
import TaskForm from '../components/TaskForm.vue'

const route = useRoute()
const projectId = route.params.id

const project = ref(null)
const tasks = ref([])
const loading = ref(true)
const error = ref(null)

// Filtrage et Tri
const filterText = ref('')
const filterPriority = ref('')
const filterResponsable = ref('')
const sortBy = ref('none')

const fetchProjectData = async () => {
  try {
    const [projectRes, tasksRes] = await Promise.all([
      fetch(`http://localhost:3001/api/projects/${projectId}`),
      fetch(`http://localhost:3001/api/tasks`)
    ])
    
    if (!projectRes.ok) throw new Error('Projet non trouvé')
    
    project.value = await projectRes.json()
    const allTasks = await tasksRes.json()
    // Filtrer les tâches par projet
    tasks.value = allTasks.filter(t => t.projetId === projectId)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchProjectData)

const handleTaskAdded = (newTask) => {
  tasks.value.push(newTask)
}

const handleTaskDropped = async ({ taskId, newStatus }) => {
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  if (taskIndex === -1) return
  
  const oldStatus = tasks.value[taskIndex].statut
  if (oldStatus === newStatus) return
  
  // Optimistic UI update
  tasks.value[taskIndex].statut = newStatus
  
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: newStatus })
    })
    if (!response.ok) throw new Error('Erreur de mise à jour')
  } catch (err) {
    // Revert on error
    tasks.value[taskIndex].statut = oldStatus
    alert("Impossible de déplacer la tâche : " + err.message)
  }
}

// Édition et Suppression
const editingTask = ref(null)

const handleEditTask = (task) => {
  editingTask.value = { ...task }
}

const saveEditedTask = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${editingTask.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTask.value)
    })
    if (!response.ok) throw new Error('Erreur lors de la modification')
    
    const updatedTask = await response.json()
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
    editingTask.value = null
  } catch (err) {
    alert(err.message)
  }
}

const handleDeleteTask = async (taskId) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      tasks.value = tasks.value.filter(t => t.id !== taskId)
    } catch (err) {
      alert(err.message)
    }
  }
}

// Tâches filtrées et triées
const filteredTasks = computed(() => {
  let result = tasks.value.filter(task => {
    const matchText = task.titre.toLowerCase().includes(filterText.value.toLowerCase()) || 
                      task.responsable.toLowerCase().includes(filterText.value.toLowerCase())
    const matchPriority = filterPriority.value ? task.priorite === filterPriority.value : true
    const matchResp = filterResponsable.value ? task.responsable.toLowerCase().includes(filterResponsable.value.toLowerCase()) : true
    return matchText && matchPriority && matchResp
  })
  
  if (sortBy.value === 'echeance_asc') {
    result.sort((a, b) => new Date(a.echeance) - new Date(b.echeance))
  } else if (sortBy.value === 'echeance_desc') {
    result.sort((a, b) => new Date(b.echeance) - new Date(a.echeance))
  } else if (sortBy.value === 'priorite') {
    const prioScore = { high: 3, medium: 2, low: 1 }
    result.sort((a, b) => (prioScore[b.priorite] || 0) - (prioScore[a.priorite] || 0))
  }
  
  return result
})

const columns = [
  { id: 'todo', title: 'À faire' },
  { id: 'in-progress', title: 'En cours' },
  { id: 'blocked', title: 'Bloqué' },
  { id: 'done', title: 'Terminé' }
]

const getTasksByStatus = (status) => {
  return filteredTasks.value.filter(t => t.statut === status)
}
</script>

<template>
  <div class="kanban-view">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else>
      <header class="kanban-header">
        <div class="header-main">
          <h2>{{ project.nom }} <span class="badge">{{ project.statut }}</span></h2>
          <p>Chef de projet: <strong>{{ project.chef }}</strong> | Lieu: <strong>{{ project.lieu }}</strong></p>
        </div>
        <div v-if="project.notes" class="project-notes card">
          <strong>Notes du chantier :</strong>
          <p>{{ project.notes }}</p>
        </div>
      </header>
      
      <TaskForm :projectId="projectId" @task-added="handleTaskAdded" />
      
      <div class="filters card">
        <div class="filter-group">
          <label>Texte :</label>
          <input type="text" v-model="filterText" placeholder="Titre..." />
        </div>
        <div class="filter-group">
          <label>Responsable :</label>
          <input type="text" v-model="filterResponsable" placeholder="Nom..." />
        </div>
        <div class="filter-group">
          <label>Priorité :</label>
          <select v-model="filterPriority">
            <option value="">Toutes</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Trier par :</label>
          <select v-model="sortBy">
            <option value="none">Aucun</option>
            <option value="echeance_asc">Échéance (croissant)</option>
            <option value="echeance_desc">Échéance (décroissant)</option>
            <option value="priorite">Priorité</option>
          </select>
        </div>
      </div>
      
      <div class="kanban-board">
        <KanbanColumn 
          v-for="col in columns" 
          :key="col.id"
          :title="col.title"
          :columnId="col.id"
          :tasks="getTasksByStatus(col.id)"
          @task-dropped="handleTaskDropped"
          @edit-task="handleEditTask"
          @delete-task="handleDeleteTask"
        />
      </div>

      <!-- Modale d'édition -->
      <div v-if="editingTask" class="modal-overlay" @click.self="editingTask = null">
        <div class="modal card">
          <h3>Modifier la tâche</h3>
          <form @submit.prevent="saveEditedTask">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" v-model="editingTask.titre" required />
            </div>
            <div class="form-group">
              <label>Responsable</label>
              <input type="text" v-model="editingTask.responsable" required />
            </div>
            <div class="form-group">
              <label>Échéance</label>
              <input type="date" v-model="editingTask.echeance" required />
            </div>
            <div class="form-group">
              <label>Priorité</label>
              <select v-model="editingTask.priorite">
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
            <div class="actions mt-2">
              <button type="submit" class="btn btn-primary">Enregistrer</button>
              <button type="button" class="btn" @click="editingTask = null">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-grey);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-main {
  flex: 1;
}

.project-notes {
  flex: 1;
  min-width: 300px;
  background-color: #FFFFAF; /* Post-it yellow */
  border-left: 4px solid #ED8936;
  margin-bottom: 0;
}

.kanban-header h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge {
  font-size: 0.9rem;
  background-color: var(--secondary-blue);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.filters {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group input, 
.filter-group select {
  padding: 0.4rem;
  border: 1px solid var(--border-grey);
  border-radius: 4px;
}

.kanban-board {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

/* Scrollbar styling for board */
.kanban-board::-webkit-scrollbar {
  height: 8px;
}
.kanban-board::-webkit-scrollbar-track {
  background: var(--light-grey);
  border-radius: 4px;
}
.kanban-board::-webkit-scrollbar-thumb {
  background: var(--border-grey);
  border-radius: 4px;
}
.kanban-board::-webkit-scrollbar-thumb:hover {
  background: var(--dark-grey);
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.mt-2 {
  margin-top: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-grey);
  border-radius: 4px;
}
</style>
