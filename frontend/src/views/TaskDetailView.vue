<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const taskId = route.params.id

const task = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchTaskData = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`)
    if (!response.ok) throw new Error('Tâche non trouvée')
    task.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchTaskData)

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'var(--danger)';
    case 'medium': return 'var(--orange)';
    case 'low': return 'var(--success)';
    default: return 'var(--dark-grey)';
  }
}

const newComment = ref('')

const addComment = async () => {
  if (!newComment.value.trim()) return
  
  const commentObj = {
    id: Date.now(),
    auteur: "Conducteur de travaux", // Utilisateur simulé
    texte: newComment.value,
    date: new Date().toISOString()
  }
  
  const updatedTask = { ...task.value }
  if (!updatedTask.commentaires) updatedTask.commentaires = []
  updatedTask.commentaires.push(commentObj)
  
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    if (!response.ok) throw new Error('Erreur lors de l\'ajout du commentaire')
    
    task.value = await response.json()
    newComment.value = ''
  } catch (err) {
    alert(err.message)
  }
}

const formatStatus = (status) => {
  const statusMap = {
    'todo': 'À faire',
    'in-progress': 'En cours',
    'blocked': 'Bloqué',
    'done': 'Terminé'
  }
  return statusMap[status] || status
}
</script>

<template>
  <div class="task-detail-view">
    <div v-if="loading" class="loading">Chargement de la tâche...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="task" class="card detail-card">
      <div class="header-actions">
        <button @click="router.back()" class="btn">← Retour au Kanban</button>
      </div>
      
      <h2>{{ task.titre }}</h2>
      
      <div class="detail-grid">
        <div class="detail-item">
          <span class="label">Responsable</span>
          <span class="value">👤 {{ task.responsable }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">Échéance</span>
          <span class="value">📅 {{ new Date(task.echeance).toLocaleDateString() }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">Statut</span>
          <span class="value badge-status">{{ formatStatus(task.statut) }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">Priorité</span>
          <span class="value prio-badge" :style="{ backgroundColor: getPriorityColor(task.priorite) }">
            {{ task.priorite }}
          </span>
        </div>
        
        <div class="detail-item">
          <span class="label">ID Tâche</span>
          <span class="value id-text">#{{ task.id }}</span>
        </div>
      </div>
      
      <div class="comments-section mt-4">
        <h3>Commentaires</h3>
        <div class="comments-list">
          <div v-for="c in task.commentaires" :key="c.id" class="comment">
            <div class="comment-header">
              <strong>{{ c.auteur }}</strong>
              <small>{{ new Date(c.date).toLocaleString() }}</small>
            </div>
            <p>{{ c.texte }}</p>
          </div>
          <div v-if="!task.commentaires || task.commentaires.length === 0" class="empty-msg">
            Aucun commentaire.
          </div>
        </div>
        
        <form @submit.prevent="addComment" class="comment-form mt-2">
          <textarea v-model="newComment" placeholder="Ajouter un commentaire..." rows="3" required></textarea>
          <button type="submit" class="btn btn-primary mt-1">Commenter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem;
}

.header-actions {
  margin-bottom: 2rem;
}

.detail-card h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--light-grey);
  padding-bottom: 1rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.9rem;
  color: #A0AEC0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.value {
  font-size: 1.1rem;
  font-weight: 500;
}

.badge-status {
  display: inline-block;
  background-color: var(--secondary-blue);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  width: fit-content;
}

.prio-badge {
  display: inline-block;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  width: fit-content;
}

.id-text {
  color: #718096;
  font-family: monospace;
}

.mt-4 { margin-top: 2rem; }
.mt-2 { margin-top: 1rem; }
.mt-1 { margin-top: 0.5rem; }

.comments-section h3 {
  border-bottom: 1px solid var(--border-grey);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.comment {
  background-color: var(--light-grey);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.comment-header small {
  color: #718096;
}

.comment-form textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-grey);
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
}

.empty-msg {
  color: #A0AEC0;
  font-style: italic;
  margin-bottom: 1rem;
}
</style>
