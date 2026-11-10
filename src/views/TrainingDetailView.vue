<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { exercises } from '../data/exercises.js'
import { saveTrainingRecord } from '../utils/trainingRecords.js'

const route = useRoute()
const isSaved = ref(false)

// 주소에 포함된 운동 ID로 해당 운동 찾기
const exercise = computed(() =>
  exercises.find((item) => item.id === route.params.id),
)

function completeTraining() {
  if (!exercise.value) return

  saveTrainingRecord(exercise.value)
  isSaved.value = true
}

const positionName = computed(() =>
  exercise.value?.position === 'pitcher' ? '투수' : '타자',
)

const categoryNames = {
  mobility: '가동성',
  strength: '근력',
  mechanics: '메커니즘',
}

const difficultyNames = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}
</script>

<template>
  <main v-if="exercise" class="detail-page">
    <header class="detail-header">
      <RouterLink to="/training" class="back-link">
        ← 훈련 목록으로
      </RouterLink>

      <p class="eyebrow">TRAINING DETAIL</p>
      <h1>{{ exercise.name }}<span>.</span></h1>
      <p class="description">{{ exercise.detail }}</p>

      <div class="tags">
        <span>{{ positionName }}</span>
        <span>{{ categoryNames[exercise.category] }}</span>
        <span>{{ difficultyNames[exercise.difficulty] }}</span>
      </div>
    </header>

    <section class="info-grid">
      <div class="info-card">
        <span>운동 시간</span>
        <strong>{{ exercise.duration }}분</strong>
      </div>
      <div class="info-card">
        <span>권장 세트</span>
        <strong>{{ exercise.sets }}세트</strong>
      </div>
      <div class="info-card">
        <span>반복 횟수</span>
        <strong>{{ exercise.reps }}</strong>
      </div>
    </section>

    <section class="content-card">
      <h2>운동 목적</h2>
      <p>{{ exercise.purpose }}</p>
    </section>

    <section class="content-card">
      <h2>운동 방법</h2>
      <ol class="instruction-list">
        <li
          v-for="(instruction, index) in exercise.instructions"
          :key="index"
        >
          <span class="step-number">{{ index + 1 }}</span>
          <p>{{ instruction }}</p>
        </li>
      </ol>
    </section>

    <section class="content-card">
      <h2>준비 장비</h2>
      <p>
        {{
          exercise.equipment.length
            ? exercise.equipment.join(', ')
            : '별도의 장비가 필요하지 않습니다.'
        }}
      </p>
    </section>

    <section class="precaution-card">
      <h2>주의사항</h2>
      <p>{{ exercise.precautions }}</p>
    </section>
    
    <button
        class="complete-button"
        :disabled="isSaved"
        @click="completeTraining"
        >
        {{ isSaved ? '✓ 훈련 기록 저장 완료' : '오늘 훈련 완료하기' }}
    </button>
    
    <RouterLink to="/training" class="bottom-link">
      훈련 목록으로 돌아가기 →
    </RouterLink>
    
  </main>

  <main v-else class="not-found">
    <h1>훈련 정보를 찾을 수 없습니다.</h1>
    <RouterLink to="/training">훈련 목록으로 돌아가기</RouterLink>
  </main>

</template>

<style scoped>
.detail-page {
  width: min(100% - 36px, 760px);
  min-height: 100vh;
  margin: 0 auto;
  padding-bottom: 50px;
  color: #f3f5f9;
}

.detail-header {
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

.detail-header h1 {
  margin: 0;
  font-size: clamp(28px, 6vw, 40px);
  line-height: 1.4;
  letter-spacing: -1.5px;
  overflow-wrap: break-word;
}

.detail-header h1 span {
  color: #b8f36b;
}

.description {
  color: #98a3b5;
  font-size: 13px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 18px;
}

.tags span {
  padding: 7px 10px;
  border-radius: 6px;
  background: #253326;
  color: #b8f36b;
  font-size: 11px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.info-card,
.content-card,
.precaution-card {
  padding: 20px;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
}

.info-card span {
  display: block;
  margin-bottom: 10px;
  color: #98a3b5;
  font-size: 11px;
}

.info-card strong {
  font-size: 14px;
}

.content-card {
  margin-top: 14px;
}

.content-card h2,
.precaution-card h2 {
  margin: 0 0 15px;
  font-size: 16px;
}

.content-card > p,
.precaution-card p {
  margin: 0;
  color: #b7c1cf;
  font-size: 13px;
  line-height: 1.9;
}

.instruction-list {
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.instruction-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-number {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: #253326;
  color: #b8f36b;
  font-size: 12px;
  font-weight: 700;
}

.instruction-list p {
  margin: 3px 0 0;
  color: #b7c1cf;
  font-size: 13px;
  line-height: 1.8;
}

.precaution-card {
  margin-top: 14px;
  border-color: #554735;
  background: #211d19;
}

.precaution-card h2 {
  color: #f0c47a;
}

.precaution-card p {
  color: #d2c2a9;
  font-size: 13px;
  line-height: 1.8;
}

.bottom-link {
  display: block;
  margin-top: 20px;
  padding: 16px;
  border-radius: 10px;
  background: #b8f36b;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}

.not-found {
  padding: 60px 20px;
  color: #f3f5f9;
  text-align: center;
}

.not-found a {
  color: #b8f36b;
}

@media (max-width: 420px) {
  .info-grid {
    gap: 7px;
  }

  .info-card {
    padding: 14px 10px;
  }

  .info-card strong {
    font-size: 12px;
  }
}

.complete-button {
  width: 100%;
  min-height: 54px;
  margin-top: 14px;
  border: none;
  border-radius: 10px;
  background: #b8f36b;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.complete-button:disabled {
  background: #344331;
  color: #b8f36b;
  cursor: default;
}
</style>
