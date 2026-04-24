<script setup>
import { ref, defineEmits, defineProps } from 'vue'

const props = defineProps({
  projectId: String
})

const emit = defineEmits(['task-added'])

const formData = ref({
  titre: '',
  responsable: '',
  echeance: '',
  priorite: 'medium',
  statut: 'todo'
})

const loading = ref(false)
const error = ref(null)

const submitTask = async () => {
  if (!formData.value.titre || !formData.value.responsable || !formData.value.echeance) {
    error.value = "Veuillez remplir tous les champs obligatoires."
    return
  }

  loading.value = true
  error.value = null

  try {
    const payload = {
      ...formData.value,
      projetId: props.projectId
    }

    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error("Erreur lors de l'ajout de la tâche")
    
    const newTask = await response.json()
    emit('task-added', newTask)
    
    // Reset form
    formData.value = {
      titre: '',
      responsable: '',
      echeance: '',
      priorite: 'medium',
      statut: 'todo'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="task-form card">
    <h3>Ajouter une nouvelle tâche</h3>
    <form @submit.prevent="submitTask">
      <div class="form-group">
        <label>Titre de la tâche *</label>
        <input type="text" v-model="formData.titre" required />
      </div>
      
      <div class="form-group">
        <label>Responsable *</label>
        <input type="text" v-model="formData.responsable" required />
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Échéance *</label>
          <input type="date" v-model="formData.echeance" required />
        </div>
        
        <div class="form-group">
          <label>Priorité</label>
          <select v-model="formData.priorite">
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Statut</label>
          <select v-model="formData.statut">
            <option value="todo">À faire</option>
            <option value="in-progress">En cours</option>
            <option value="blocked">Bloqué</option>
            <option value="done">Terminé</option>
          </select>
        </div>
      </div>
      
      <div v-if="error" class="error-msg">{{ error }}</div>
      
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Ajout...' : 'Ajouter la tâche' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.task-form {
  margin-bottom: 2rem;
  background-color: var(--light-grey);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.form-group input, 
.form-group select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--border-grey);
  border-radius: 4px;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.error-msg {
  color: var(--danger);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
