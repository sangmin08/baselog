<script setup>
import { ref, computed } from 'vue'
import {
  getTrainingRecords,
  deleteTrainingRecord,
} from '../utils/trainingRecords.js'

// 저장된 훈련 기록 불러오기
const records = ref(getTrainingRecords())

// 총 훈련 시간 계산하기
const totalMinutes = computed(() => {
  return records.value.reduce((total, record) => {
    return total + record.duration
  }, 0)
})

function removeRecord(id) {
  const isConfirmed = confirm('이 훈련 기록을 삭제하시겠습니까?')

  if (!isConfirmed) return

  records.value = deleteTrainingRecord(id)
}
</script>

<template>
  <main class="records-page">
    <header class="page-header">
      <RouterLink to="/" class="back-link">
        ← BASELOG 홈
      </RouterLink>

      <p class="eyebrow">MY TRAINING RECORDS</p>
      <h1>나의 훈련 기록<span>.</span></h1>
      <p class="description">
        지금까지 완료한 훈련을 확인해 보세요.
      </p>
    </header>

    <section class="summary-grid">
      <div class="summary-card">
        <span>총 훈련 횟수</span>
        <strong>{{ records.length }}회</strong>
      </div>

      <div class="summary-card">
        <span>총 운동 시간</span>
        <strong>{{ totalMinutes }}분</strong>
      </div>
    </section>

    <section class="records-section">
      <h2>최근 훈련 내역</h2>

      <div v-if="records.length > 0" class="record-list">

        <article
        v-for="record in records"
        :key="record.id"
        class="record-card"
        >
        <div class="record-header">
            <h3>{{ record.exerciseName }}</h3>

            <button
            type="button"
            class="delete-button"
            @click="removeRecord(record.id)"
            >
            삭제
            </button>
        </div>


          <p>
            {{ record.duration }}분 ·
            {{ record.sets }}세트 ·
            {{ record.reps }}
          </p>

          <small>
            {{ new Date(record.completedAt).toLocaleString('ko-KR') }}
          </small>
        </article>
      </div>

      <div v-else class="empty-state">
        <p>아직 완료한 훈련이 없습니다.</p>
        <RouterLink to="/training">
          첫 훈련 시작하기 →
        </RouterLink>
      </div>
    </section>
  </main>
</template>


<style scoped>
.records-page {
  width: min(100% - 36px, 760px);
  min-height: 100vh;
  margin: 0 auto;
  padding-bottom: 50px;
  color: #f3f5f9;
}

.page-header {
  padding: 35px 0 28px;
}

.back-link {
  display: inline-block;
  margin-bottom: 34px;
  color: #aab5c5;
  font-size: 13px;
  text-decoration: none;
}

.eyebrow {
  margin-bottom: 12px;
  color: #b8f36b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.page-header h1 {
  margin: 0;
  font-size: clamp(28px, 6vw, 40px);
  letter-spacing: -1.5px;
}

.page-header h1 span {
  color: #b8f36b;
}

.description {
  margin-top: 12px;
  color: #98a3b5;
  font-size: 13px;
  line-height: 1.8;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.summary-card {
  padding: 20px;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
}

.summary-card span {
  display: block;
  margin-bottom: 12px;
  color: #98a3b5;
  font-size: 12px;
}

.summary-card strong {
  color: #b8f36b;
  font-size: 23px;
}

.records-section {
  margin-top: 32px;
}

.records-section h2 {
  margin-bottom: 16px;
  font-size: 17px;
}

.record-list {
  display: grid;
  gap: 12px;
}

.record-card {
  padding: 20px;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
}

.record-card h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.record-card p {
  margin-bottom: 12px;
  color: #c3cede;
  font-size: 13px;
}

.record-card small {
  color: #98a3b5;
  font-size: 11px;
}

.empty-state {
  padding: 40px 20px;
  border: 1px dashed #354054;
  border-radius: 13px;
  text-align: center;
}

.empty-state p {
  color: #98a3b5;
  font-size: 13px;
}

.empty-state a {
  display: inline-block;
  margin-top: 14px;
  color: #b8f36b;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 480px) {
  .summary-card {
    padding: 16px;
  }

  .summary-card strong {
    font-size: 19px;
  }

  .record-card {
    padding: 16px;
  }
}

.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.record-header h3 {
  margin: 0;
}

.delete-button {
  flex-shrink: 0;
  padding: 7px 12px;
  border: 1px solid #554047;
  border-radius: 7px;
  background: #2b1d25;
  color: #ff9b9b;
  font-size: 12px;
  cursor: pointer;
}

.delete-button:hover {
  background: #422630;
}

</style>
