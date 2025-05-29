<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>总用户数</h3>
        <div class="stat-number">1,234</div>
        <div class="stat-trend positive">
          <span>↑ 12%</span>
          较上月
        </div>
      </div>
      <div class="stat-card">
        <h3>总订单数</h3>
        <div class="stat-number">856</div>
        <div class="stat-trend positive">
          <span>↑ 23%</span>
          较上月
        </div>
      </div>
      <div class="stat-card">
        <h3>总收入</h3>
        <div class="stat-number">¥89,634</div>
        <div class="stat-trend positive">
          <span>↑ 18%</span>
          较上月
        </div>
      </div>
      <div class="stat-card">
        <h3>活跃用户</h3>
        <div class="stat-number">432</div>
        <div class="stat-trend negative">
          <span>↓ 5%</span>
          较上月
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h2 {
  margin-bottom: 24px;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.stat-trend {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.positive {
  color: #059669;
}

.stat-trend.negative {
  color: #dc2626;
}

.stat-trend span {
  font-weight: 500;
}
</style> 