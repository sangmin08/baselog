<script setup>
import { ref, computed } from 'vue'
import { getTrainingRecords } from '../utils/trainingRecords.js'

// 저장된 전체 훈련 기록
const records = ref(getTrainingRecords())

// 이번 주 시작일 (월요일)
const startOfWeek = new Date()
const day = startOfWeek.getDay()

const diff = day === 0 ? -6 : 1 - day

startOfWeek.setDate(startOfWeek.getDate() + diff)
startOfWeek.setHours(0, 0, 0, 0)

// 이번 주 훈련 기록만 가져오기
const weeklyRecords = computed(() => {
  return records.value.filter((record) => {
    const date = new Date(record.completedAt)

    return date >= startOfWeek && date <= new Date()
  })
})

// 이번 주 총 훈련 횟수
const weeklyCount = computed(() => {
  return weeklyRecords.value.length
})

// 이번 주 총 운동 시간
const weeklyMinutes = computed(() => {
  return weeklyRecords.value.reduce((total, record) => {
    return total + Number(record.duration || 0)
  }, 0)
})


// 월요일부터 일요일까지 표시할 요일
const weekDays = ['월', '화', '수', '목', '금', '토', '일']

// 요일별 훈련 시간 계산
const dailyTraining = computed(() => {
  return weekDays.map((day, index) => {
    const dailyMinutes = weeklyRecords.value
      .filter((record) => {
        const recordDate = new Date(record.completedAt)

        // JavaScript: 일요일 0, 월요일 1
        // 그래프: 월요일 0, 일요일 6
        const dayIndex = (recordDate.getDay() + 6) % 7

        return dayIndex === index
      })
      .reduce((total, record) => {
        return total + Number(record.duration || 0)
      }, 0)

    return {
      day,
      minutes: dailyMinutes,
    }
  })
})

 // 이번 주 투수 훈련 횟수
const pitcherCount = computed(() => {
  return weeklyRecords.value.filter((record) => {
    return record.position === 'pitcher'
  }).length
})

// 이번 주 타자 훈련 횟수
const hitterCount = computed(() => {
  return weeklyRecords.value.filter((record) => {
    return record.position === 'hitter'
  }).length
})

// 투수·타자 훈련 비율 계산
const positionRatio = computed(() => {
  const total = pitcherCount.value + hitterCount.value

  if (total === 0) {
    return {
      pitcher: 0,
      hitter: 0,
    }
  }

  return {
    pitcher: Math.round((pitcherCount.value / total) * 100),
    hitter: Math.round((hitterCount.value / total) * 100),
  }
})


</script>

<template>
  <main class="analytics-page">
    <header class="page-header">
      <RouterLink to="/" class="back-link">
        ← BASELOG 홈
      </RouterLink>

      <p class="eyebrow">BASELOG ANALYTICS</p>
      <h1>나의 훈련 분석<span>.</span></h1>
      <p class="description">
        이번 주 훈련 성과를 확인해 보세요.
      </p>
    </header>

    <section class="summary-grid">
      <div class="summary-card">
        <p>이번 주 훈련 횟수</p>
        <strong>{{ weeklyCount }}회</strong>
      </div>

      <div class="summary-card">
        <p>이번 주 운동 시간</p>
        <strong>{{ weeklyMinutes }}분</strong>
      </div>
    </section>

    <section class="analysis-section">
      <h2>이번 주 훈련 현황</h2>

      <div v-if="weeklyCount > 0" class="analysis-card">
        <p>이번 주에 총 {{ weeklyCount }}번 훈련했습니다.</p>
        <p>권장 운동 시간 합계는 {{ weeklyMinutes }}분입니다.</p>
      </div>

      <div v-else class="empty-state">
        <p>이번 주에는 아직 완료한 훈련이 없습니다.</p>
        <RouterLink to="/training">
          첫 훈련 시작하기 →
        </RouterLink>
      </div>
    </section>

    <section class="chart-section">
    <h2>요일별 훈련 시간</h2>

    <div class="chart-card">
        <div class="chart-container">
        <div
            v-for="item in dailyTraining"
            :key="item.day"
            class="chart-item"
        >
            <span class="chart-value">
            {{ item.minutes }}분
            </span>

            <div class="chart-bar-area">
            <div
                class="chart-bar"
                :style="{
                height: `${Math.max(
                    0,
                    Math.min(
                    100,
                    (item.minutes / Math.max(1, ...dailyTraining.map(d => d.minutes))) * 100
                    )
                )}%`
                }"
            ></div>
            </div>

            <span class="chart-day">
            {{ item.day }}
            </span>
        </div>
        </div>
    </div>
    </section>
    
    <section class="position-section">
    <h2>포지션별 훈련 분석</h2>

    <div class="position-card">
        <div class="position-header">
        <span>이번 주 훈련 비율</span>
        <strong>{{ pitcherCount + hitterCount }}회</strong>
        </div>

        <div class="position-progress">
        <div
            class="position-pitcher"
            :style="{ width: `${positionRatio.pitcher}%` }"
        ></div>

        <div
            class="position-hitter"
            :style="{ width: `${positionRatio.hitter}%` }"
        ></div>
        </div>

        <div class="position-stats">
        <div class="position-stat">
            <div class="position-label">
            <span class="position-dot pitcher-dot"></span>
            <span>투수 훈련</span>
            </div>

            <strong>{{ pitcherCount }}회</strong>
            <p>{{ positionRatio.pitcher }}%</p>
        </div>

        <div class="position-stat">
            <div class="position-label">
            <span class="position-dot hitter-dot"></span>
            <span>타자 훈련</span>
            </div>

            <strong>{{ hitterCount }}회</strong>
            <p>{{ positionRatio.hitter }}%</p>
        </div>
        </div>

        <p
        v-if="pitcherCount + hitterCount === 0"
        class="position-empty"
        >
        이번 주 포지션별 훈련 기록이 없습니다.
        </p>
    </div>
    </section>

  </main>
</template>

<style scoped>
.analytics-page {
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

.summary-card p {
  margin: 0 0 12px;
  color: #98a3b5;
  font-size: 12px;
}

.summary-card strong {
  color: #b8f36b;
  font-size: 23px;
}

.analysis-section {
  margin-top: 32px;
}

.analysis-section h2 {
  margin-bottom: 16px;
  font-size: 17px;
}

.analysis-card {
  padding: 20px;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
}

.analysis-card p {
  color: #c3cede;
  font-size: 13px;
  line-height: 1.8;
}

.analysis-card p:first-child {
  margin-top: 0;
}

.analysis-card p:last-child {
  margin-bottom: 0;
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

  .analysis-card {
    padding: 16px;
  }
}


.chart-section {
  margin-top: 32px;
}

.chart-section h2 {
  margin-bottom: 16px;
  font-size: 17px;
}

.chart-card {
  padding: 22px 14px;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  align-items: end;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.chart-value {
  color: #b8f36b;
  font-size: 11px;
  white-space: nowrap;
}

.chart-bar-area {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 140px;
  border-bottom: 1px solid #354054;
}

.chart-bar {
  width: min(100%, 28px);
  min-height: 0;
  margin: 0 auto;
  border-radius: 5px 5px 0 0;
  background: #b8f36b;
  transition: height 0.3s ease;
}

.chart-day {
  color: #98a3b5;
  font-size: 12px;
}

@media (max-width: 480px) {
  .chart-card {
    padding: 18px 10px;
  }

  .chart-container {
    gap: 4px;
  }

  .chart-value {
    font-size: 9px;
  }

  .chart-bar-area {
    height: 110px;
  }
}

.position-section {
  margin-top: 32px;
}

.position-section h2 {
  margin-bottom: 16px;
  font-size: 17px;
}

.position-card {
  padding: 22px;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.position-header span {
  color: #98a3b5;
  font-size: 12px;
}

.position-header strong {
  color: #f3f5f9;
  font-size: 14px;
}

.position-progress {
  display: flex;
  width: 100%;
  height: 12px;
  overflow: hidden;
  border-radius: 20px;
  background: #293243;
}

.position-pitcher {
  height: 100%;
  background: #b8f36b;
  transition: width 0.3s ease;
}

.position-hitter {
  height: 100%;
  background: #5c8dff;
  transition: width 0.3s ease;
}

.position-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.position-stat {
  padding: 15px;
  border: 1px solid #293243;
  border-radius: 10px;
}

.position-label {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  color: #98a3b5;
  font-size: 12px;
}

.position-dot {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
}

.pitcher-dot {
  background: #b8f36b;
}

.hitter-dot {
  background: #5c8dff;
}

.position-stat strong {
  display: block;
  color: #f3f5f9;
  font-size: 22px;
}

.position-stat p {
  margin: 5px 0 0;
  color: #98a3b5;
  font-size: 12px;
}

.position-empty {
  margin: 18px 0 0;
  color: #98a3b5;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 480px) {
  .position-card {
    padding: 16px;
  }

  .position-stat {
    padding: 12px;
  }
}

</style>
