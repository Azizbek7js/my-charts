<!-- components/BlockSelectorModal.vue -->
<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add New Block</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <div class="block-types">
          <div
              v-for="type in blockTypes"
              :key="type.id"
              class="block-type-item"
              @click="addBlock(type.id)"
          >
            <div class="block-type-icon">
              <span>{{ type.icon }}</span>
            </div>
            <div class="block-type-info">
              <h4>{{ type.name }}</h4>
              <p>{{ type.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  blockTypes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'add-block']);

const addBlock = (typeId) => {
  emit('add-block', typeId);
  emit('close');
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #4a5568;
}

.modal-body {
  padding: 24px;
}

.block-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.block-type-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f7fafc;
  cursor: pointer;
  transition: all 0.2s;
}

.block-type-item:hover {
  background-color: #edf2f7;
  transform: translateY(-2px);
}

.block-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.block-type-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.block-type-info p {
  margin: 0;
  font-size: 14px;
  color: #718096;
}

@media (max-width: 768px) {
  .block-types {
    grid-template-columns: 1fr;
  }
}
</style>