<script setup>
import { ref, computed } from 'vue'
import {
  getTrainingRecords,
  deleteTrainingRecord,
} from '../utils/trainingRecords.js'

// 저장된 훈련 기록 불러오기
const records = ref(getTrainingRecords())


// 선택한 날짜 필터
const selectedPeriod = ref('all')
const selectedPosition = ref('all')

// 날짜별 훈련 기록 필터링
const filteredRecords = computed(() => {
  const now = new Date()

  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  let startDate = new Date(today)

  if (selectedPeriod.value === 'week') {
    startDate.setDate(today.getDate() - 6)
  } else if (selectedPeriod.value === 'month') {
    startDate.setDate(today.getDate() - 29)
  }

  return records.value.filter((record) => {
    const recordDate = new Date(record.completedAt)

    // 날짜 필터
    const matchesPeriod =
      selectedPeriod.value === 'all' ||
      (recordDate >= startDate && recordDate <= now)

    // 포지션 필터
    const matchesPosition =
      selectedPosition.value === 'all' ||
      record.position === selectedPosition.value

    // 두 조건을 모두 만족하는 기록만 표시
    return matchesPeriod && matchesPosition
  })
})



// 총 훈련 시간 계산하기

const totalMinutes = computed(() => {
  return filteredRecords.value.reduce((total, record) => {
    return total + Number(record.duration || 0)
  }, 0)
})

// 선택한 기간의 총 훈련 횟수
const totalCount = computed(() => {
  return filteredRecords.value.length
})

function removeRecord(id) {
  const isConfirmed = confirm('이 훈련 기록을 삭제하시겠습니까?')

  if (!isConfirmed) return

  records.value = deleteTrainingRecord(id)
}


// 포지션을 한글로 변환
const getPositionLabel = (position) => {
  if (position === 'pitcher') return '투수'
  if (position === 'hitter') return '타자'
  return '기타'
}

// 훈련 날짜를 상대 날짜로 변환
const getRelativeDate = (completedAt) => {
  const today = new Date()
  const recordDate = new Date(completedAt)

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const recordStart = new Date(
    recordDate.getFullYear(),
    recordDate.getMonth(),
    recordDate.getDate()
  )

  const diffDays = Math.round(
    (todayStart - recordStart) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '1일 전'
  if (diffDays > 1) return `${diffDays}일 전`

  return '미래 날짜'
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
        <strong>{{ totalCount }}회</strong>
      </div>

      <div class="summary-card">
        <span>총 운동 시간</span>
        <strong>{{ totalMinutes }}분</strong>
      </div>
    </section>

    <section class="records-section">
      <h2>최근 훈련 내역</h2>

      <div class="period-filter">
        <button
          v-for="period in [
            { label: '전체', value: 'all' },
            { label: '오늘', value: 'today' },
            { label: '최근 7일', value: 'week' },
            { label: '최근 30일', value: 'month' },
          ]"
          :key="period.value"
          type="button"
          :class="{ active: selectedPeriod === period.value }"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>

      <div class="position-filter">
        <button
          v-for="position in [
            { label: '전체', value: 'all' },
            { label: '투수', value: 'pitcher' },
            { label: '타자', value: 'hitter' },
          ]"
          :key="position.value"
          type="button"
          :class="{ active: selectedPosition === position.value }"
          @click="selectedPosition = position.value"
        >
          {{ position.label }}
        </button>
      </div>

      <div v-if="filteredRecords.length > 0" class="record-list">
        <article
          v-for="record in filteredRecords"
          :key="record.id"
          class="record-card"
        >

          <div class="record-header">
            <div class="record-title-group">
              <h3>{{ record.exerciseName }}</h3>

              <div class="record-badges">
                <span
                  class="position-badge"
                  :class="record.position"
                >
                  {{ getPositionLabel(record.position) }}
                </span>

                <span class="date-badge">
                  {{ getRelativeDate(record.completedAt) }}
                </span>
              </div>
            </div>

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

          <div
            v-if="record.actualSets != null"
            class="actual-training-info"
          >
            <p class="actual-training-title">실제 훈련 기록</p>

            <div class="actual-training-grid">
              <div class="actual-training-item">
                <span>수행 세트</span>
                <strong>{{ record.actualSets }}세트</strong>
              </div>

              <div class="actual-training-item">
                <span>반복 횟수</span>
                <strong>{{ record.actualReps }}회</strong>
              </div>

              <div class="actual-training-item">
                <span>운동 강도</span>
                <strong>RPE {{ record.rpe }}</strong>
              </div>
            </div>
          </div>

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



.actual-training-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #293243;
}

.actual-training-title {
  margin: 0 0 12px;
  color: #98a3b5;
  font-size: 12px;
  font-weight: 600;
}

.actual-training-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.actual-training-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 8px;
  background: #0c111b;
  text-align: center;
}

.actual-training-item span {
  color: #98a3b5;
  font-size: 11px;
}

.actual-training-item strong {
  color: #b8f36b;
  font-size: 14px;
}

@media (max-width: 480px) {
  .actual-training-grid {
    gap: 6px;
  }

  .actual-training-item {
    padding: 10px 5px;
  }

  .actual-training-item strong {
    font-size: 12px;
  }
}


.record-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.record-header h3 {
  min-width: 0;
  margin: 0;
}

.record-card > p {
  margin: 0;
}

.record-card > small {
  color: #98a3b5;
}

.actual-training-info {
  width: 100%;
}

@media (max-width: 480px) {
  .record-header h3 {
    font-size: 16px;
  }
}

.period-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0 24px;
}

.period-filter button {
  padding: 10px 16px;
  border: 1px solid #293243;
  border-radius: 8px;
  background: #131a27;
  color: #98a3b5;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.period-filter button:hover {
  border-color: #b8f36b;
}

.period-filter button.active {
  border-color: #b8f36b;
  background: #b8f36b;
  color: #0c111b;
  font-weight: 700;
}

@media (max-width: 480px) {
  .period-filter {
    gap: 6px;
  }

  .period-filter button {
    padding: 9px 12px;
    font-size: 12px;
  }
}

.position-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 24px;
}

.position-filter button {
  padding: 10px 20px;
  border: 1px solid #293243;
  border-radius: 8px;
  background: #131a27;
  color: #98a3b5;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.position-filter button:hover {
  border-color: #b8f36b;
}

.position-filter button.active {
  border-color: #b8f36b;
  background: #b8f36b;
  color: #0c111b;
  font-weight: 700;
}

@media (max-width: 480px) {
  .position-filter {
    gap: 6px;
  }

  .position-filter button {
    padding: 9px 16px;
    font-size: 12px;
  }
}


.record-title-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.record-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.position-badge,
.date-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.position-badge.pitcher {
  background: rgba(184, 243, 107, 0.12);
  color: #b8f36b;
}

.position-badge.hitter {
  background: rgba(92, 141, 255, 0.12);
  color: #8aaaff;
}

.date-badge {
  background: #293243;
  color: #c3cede;
}

.delete-button {
  flex-shrink: 0;
}


</style>
