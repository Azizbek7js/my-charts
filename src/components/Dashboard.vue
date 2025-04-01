<!-- DashboardCreator.vue -->
<template>
  <div class="dashboard-creator">
    <!-- Header with user info and controls -->
    <header class="dashboard-header">
      <div class="user-info">
        <div class="user-avatar">
          <span>{{ getUserInitials() }}</span>
        </div>
        <span class="user-name">{{ userName }}</span>
      </div>
      <div class="dashboard-controls">
        <button class="control-btn add-btn" @click="openBlockSelector">
          <span>Add Block</span>
        </button>
        <button class="control-btn save-btn" @click="saveDashboard">
          <span>Save Dashboard</span>
        </button>
      </div>
    </header>

    <!-- Main dashboard area -->
    <div class="map-wrapper" >
      <grid-layout
          :layout="testLayout"
          :col-num="20"
          :row-num="20"
          :col-width="colWidth"
          :col-height="colHeight"
          :editable="true">
        <div slot="base" class="map">
          <div id="map">
          </div>
        </div>
      </grid-layout>
    </div>

    <!-- Success message -->
    <div class="success-message" v-if="showSuccessMessage">
      <div class="success-content">
        <span>✓</span> Dashboard successfully saved!
      </div>
    </div>

    <!-- Use the separated BlockSelectorModal component -->
    <BlockSelectorModal
        v-if="showBlockSelector"
        :blockTypes="blockTypes"
        @close="showBlockSelector = false"
        @add-block="addNewBlock"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import GridLayout from './GridLayout.vue';
import SparkLine from '@/components/SparkLine.vue';
import LineChart from '@/components/LineChart.vue';
import SpiralChart from '@/components/SpiralChart.vue';
import BarChart from '@/components/BarChart.vue';
import BlockSelectorModal from '@/components/BlockSelectorModal.vue';

export default {
  name: 'DashboardCreator',
  components: {
    GridLayout,
    SparkLine,
    LineChart,
    SpiralChart,
    BarChart,
    BlockSelectorModal
  },
  setup() {
    // User information
    const userName = ref('Alex Johnson');

    // Dashboard state
    const blocks = ref([]);
    const colWidth = ref(300);
    const colHeight = ref(300);
    const showBlockSelector = ref(false);
    const showSuccessMessage = ref(false);
    const previewMode = ref(false);
    const dashboardRef = ref(null);
    // Drag and resize state
    const activeBlock = ref(null);
    const resizeType = ref(null);
    const startX = ref(0);
    const startY = ref(0);
    const startWidth = ref(0);
    const startHeight = ref(0);
    const startLeft = ref(0);
    const startTop = ref(0);
    let testLayout = [
      {"x":0,"y":0,"w":4,"h":2,"i":"0", resizable: true, draggable: true},
    ];

    // Available block types with text icons instead of image URLs
    const blockTypes = [
      {
        id: 'sparkline',
        name: 'Spark Line Chart',
        description: 'Simple sparkline chart for trend visualization',
        icon: '📈'
      },
      {
        id: 'linechart',
        name: 'Line Chart',
        description: 'Detailed line chart with axes and legends',
        icon: '📊'
      },
      {
        id: 'barchart',
        name: 'Bar Chart',
        description: 'Bar chart for comparative data visualization',
        icon: '📊'
      },
      {
        id: 'spiralchart',
        name: 'Spiral Chart',
        description: 'Unique spiral chart for cyclical data',
        icon: '🌀'
      },
      {
        id: 'image',
        name: 'Image Block',
        description: 'Upload and display images in your dashboard',
        icon: '🖼️'
      }
    ];

    // Initialize with some default blocks
    onMounted(() => {
      colWidth.value = document.querySelector('.map-wrapper')?.clientWidth
      colHeight.value = document.querySelector('.map-wrapper')?.clientHeight
      blocks.value = [
        {
          id: generateId(),
          type: 'sparkline',
          title: 'Spark Line',
          position: {
            width: 500,
            height: 300,
            left: 20,
            top: 20
          }
        },
        {
          id: generateId(),
          type: 'linechart',
          title: 'Line Chart',
          position: {
            width: 500,
            height: 300,
            left: 540,
            top: 20
          }
        }
      ];

      // Add event listeners for resize and drag operations
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    onUnmounted(() => {
      // Remove event listeners when component is destroyed
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    });

    // Helper functions
    const generateId = () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const getUserInitials = () => {
      return userName.value.split(' ').map(name => name[0]).join('');
    };

    // Drag and resize handlers
    const startDrag = (event, index) => {
      activeBlock.value = index;
      const block = blocks.value[index];

      // Store starting position
      startX.value = event.clientX;
      startY.value = event.clientY;
      startLeft.value = block.position.left;
      startTop.value = block.position.top;

      // Set custom drag image (transparent)
      const img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      event.dataTransfer.setDragImage(img, 0, 0);
    };

    const endDrag = (event, index) => {
      activeBlock.value = null;
    };

    const startResize = (event, index, type) => {
      event.preventDefault();
      event.stopPropagation();

      activeBlock.value = index;
      resizeType.value = type;
      const block = blocks.value[index];

      // Store starting dimensions and position
      startX.value = event.clientX;
      startY.value = event.clientY;
      startWidth.value = block.position.width;
      startHeight.value = block.position.height;
      startLeft.value = block.position.left;
      startTop.value = block.position.top;
    };

    const handleMouseMove = (event) => {
      if (activeBlock.value === null) return;

      const block = blocks.value[activeBlock.value];
      const deltaX = event.clientX - startX.value;
      const deltaY = event.clientY - startY.value;

      if (resizeType.value === 'move') {
        // Handle dragging
        block.position.left = startLeft.value + deltaX;
        block.position.top = startTop.value + deltaY;

        // Prevent dragging outside container
        const container = dashboardRef.value;
        if (container) {
          if (block.position.left < 0) block.position.left = 0;
          if (block.position.top < 0) block.position.top = 0;
          if (block.position.left + block.position.width > container.clientWidth) {
            block.position.left = container.clientWidth - block.position.width;
          }
        }
      } else if (resizeType.value === 'se') {
        // Handle resize from south-east corner
        block.position.width = Math.max(100, startWidth.value + deltaX);
        block.position.height = Math.max(100, startHeight.value + deltaY);
      }
    };

    const handleMouseUp = () => {
      activeBlock.value = null;
      resizeType.value = null;
    };

    // Block management
    const openBlockSelector = () => {
      showBlockSelector.value = true;
    };

    const addNewBlock = (type) => {
      const newPosition = findAvailablePosition();

      const newBlock = {
        id: generateId(),
        type: type,
        title: getBlockTitleByType(type),
        position: {
          width: 500,
          height: 300,
          left: newPosition.left,
          top: newPosition.top,
        },
        imageUrl: type === 'image' ? null : undefined
      };

      blocks.value.push(newBlock);
    };

    const getBlockTitleByType = (type) => {
      const typeInfo = blockTypes.find(t => t.id === type);
      return typeInfo ? typeInfo.name : 'New Block';
    };

    const removeBlock = (index) => {
      blocks.value.splice(index, 1);
    };

    const findAvailablePosition = () => {
      const occupiedPositions = blocks.value.map(block => ({
        left: block.position.left,
        top: block.position.top,
        right: block.position.left + block.position.width,
        bottom: block.position.top + block.position.height
      }));

      // Start positions
      let posX = 20;
      let posY = 20;
      const stepSize = 20;
      const maxIterations = 100; // Prevent infinite loop

      for (let i = 0; i < maxIterations; i++) {
        // Test position with a standard block size
        const testBlock = {
          left: posX,
          top: posY,
          right: posX + 500,
          bottom: posY + 300
        };

        // Check if this position overlaps with any existing block
        if (!hasOverlap(testBlock, occupiedPositions)) {
          return { left: posX, top: posY };
        }

        // Try next position
        posX += stepSize;

        // If we're getting too far right, move down and reset X
        if (posX > 1000) {
          posX = 20;
          posY += stepSize;
        }
      }

      // If all else fails, just stack on top
      return { left: 20, top: 20 };
    };

    const hasOverlap = (block, existingBlocks) => {
      return existingBlocks.some(existing => {
        return !(
            block.left > existing.right ||
            block.right < existing.left ||
            block.top > existing.bottom ||
            block.bottom < existing.top
        );
      });
    };

    // Image handling
    const triggerImageUpload = (index) => {
      const fileInputRef = `fileInput-${index}`;
      const fileInputs = document.querySelectorAll(`input[type="file"]`);

      // Find the correct file input
      for (const input of fileInputs) {
        if (input.getAttribute('ref') === fileInputRef) {
          input.click();
          break;
        }
      }
    };

    const handleImageUpload = (event, index) => {
      const file = event.target.files[0];
      if (file) {
        // In a real app, you would upload the file to a server
        // Here we'll use a local URL
        const imageUrl = URL.createObjectURL(file);
        blocks.value[index].imageUrl = imageUrl;
      }
    };

    // Save dashboard
    const saveDashboard = () => {
      // In a real application, you would save to a database here
      showSuccessMessage.value = true;

      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000);
    };

    return {
      colHeight,
      colWidth,
      testLayout,
      userName,
      blocks,
      blockTypes,
      showBlockSelector,
      showSuccessMessage,
      previewMode,
      dashboardRef,
      getUserInitials,
      openBlockSelector,
      addNewBlock,
      removeBlock,
      saveDashboard,
      triggerImageUpload,
      handleImageUpload,
      startDrag,
      endDrag,
      startResize
    };
  }
};
</script>

<style>
/* Main container styles */
.dashboard-creator {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fa;
  color: #2d3748;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #1a202c;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
}

.dashboard-controls {
  display: flex;
  gap: 12px;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn {
  background-color: #4c51bf;
  color: white;
}

.save-btn {
  background-color: #38a169;
  color: white;
}

/* Dashboard container */
.dashboard-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f5f7fa;
}

.map-wrapper{
  width: 100%;
  height: 100%;
}
.dashboard-block {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background-color: white;
  transition: box-shadow 0.3s;
}

.dashboard-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.block-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #2d3748;
  color: white;
  cursor: move;
}

.block-title {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.block-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.block-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

/* Resize handle */
.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #4a5568;
  border-radius: 50%;
}

.resize-handle-se {
  right: 5px;
  bottom: 5px;
  cursor: se-resize;
}

/* Image block styling */
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dashboard-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf2f7;
  border: 2px dashed #cbd5e0;
  border-radius: 4px;
  cursor: pointer;
}

.file-input {
  display: none;
}

/* Success message */
.success-message {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  background-color: #38a169;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.5s 2.5s;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-controls {
    flex-direction: column;
  }

  .control-btn {
    width: 100%;
  }
}
</style>