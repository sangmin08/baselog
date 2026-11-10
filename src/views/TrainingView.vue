
<script setup>
import { computed, ref } from 'vue'
import { exercises } from '../data/exercises.js'

const position = ref('pitcher')
const category = ref('all')
const difficulty = ref('all')

const categories = [
  { value: 'all', label: '전체 종류' },
  { value: 'mobility', label: '가동성' },
  { value: 'strength', label: '근력' },
  { value: 'mechanics', label: '메커니즘' },
]

const difficulties = [
  { value: 'all', label: '전체 난이도' },
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

const filteredExercises = computed(() => {
  return exercises.filter((exercise) => {
    const matchesPosition = exercise.position === position.value
    const matchesCategory =
      category.value === 'all' || exercise.category === category.value
    const matchesDifficulty =
      difficulty.value === 'all' || exercise.difficulty === difficulty.value

    return matchesPosition && matchesCategory && matchesDifficulty
  })
})

function resetFilters() {
  category.value = 'all'
  difficulty.value = 'all'
}

function categoryName(value) {
  return categories.find((item) => item.value === value)?.label ?? value
}

function difficultyName(value) {
  return difficulties.find((item) => item.value === value)?.label ?? value
}
</script>

<template>
  <main class="training-page">
    <header class="page-header">
      <RouterLink to="/" class="back-link">← BASELOG 홈</RouterLink>
      <p class="eyebrow">TRAINING LIBRARY</p>
      <h1>나에게 맞는 훈련을<br />찾아보세요<span>.</span></h1>
      <p class="description">
        포지션과 훈련 종류에 맞춰 운동을 확인하세요.
      </p>
    </header>

    <section class="filter-section">
      <h2>포지션</h2>
      <div class="position-options">
        <button
          :class="{ active: position === 'pitcher' }"
          @click="position = 'pitcher'"
        >
          투수
        </button>
        <button
          :class="{ active: position === 'hitter' }"
          @click="position = 'hitter'"
        >
          타자
        </button>
      </div>

      <div class="filter-selects">
        <label>
          <span>훈련 종류</span>
          <select v-model="category">
            <option
              v-for="item in categories"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </label>

        <label>
          <span>난이도</span>
          <select v-model="difficulty">
            <option
              v-for="item in difficulties"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </label>
      </div>

      <button class="reset-button" @click="resetFilters">
        필터 초기화
      </button>
    </section>

    <section class="results-section">
      <div class="results-heading">
        <h2>훈련 목록</h2>
        <span>{{ filteredExercises.length }}개</span>
      </div>

      <div v-if="filteredExercises.length" class="exercise-grid">
        <RouterLink
            v-for="exercise in filteredExercises"
            :key="exercise.id"
            :to="`/training/${exercise.id}`"
            class="exercise-card"
        >
          <div class="card-top">
            <span class="category-tag">
              {{ categoryName(exercise.category) }}
            </span>
            <span class="difficulty-tag">
              {{ difficultyName(exercise.difficulty) }}
            </span>
          </div>

          <h3>{{ exercise.name }}</h3>
          <p class="exercise-purpose">{{ exercise.purpose }}</p>

          <div class="card-footer">
            <span>{{ exercise.duration }}분</span>
            <span>{{ exercise.sets }}세트</span>
            <span>{{ exercise.equipment.length ? '장비 필요' : '장비 없음' }}</span>
          </div>
        </RouterLink>
      </div>

      <div v-else class="empty-state">
        <p>조건에 맞는 훈련이 없습니다.</p>
        <button @click="resetFilters">필터 초기화하기</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.training-page {
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
  margin: 0 0 12px;
  color: #b8f36b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.page-header h1 {
  margin: 0;
  font-size: clamp(30px, 6vw, 42px);
  line-height: 1.4;
  letter-spacing: -1.5px;
}

.page-header h1 span {
  color: #b8f36b;
}

.description {
  color: #98a3b5;
  font-size: 13px;
  line-height: 1.8;
}

.filter-section,
.exercise-card {
  padding: 20px;
  border: 1px solid #293243;
  border-radius: 14px;
  background: #131a27;
}

.filter-section h2,
.results-heading h2 {
  margin: 0;
  font-size: 16px;
}

.position-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.position-options button,
.reset-button {
  min-height: 42px;
  border: 1px solid #354054;
  border-radius: 8px;
  background: #192231;
  color: #dce3ee;
}

.position-options button.active {
  border-color: #b8f36b;
  background: #253326;
  color: #b8f36b;
}

.filter-selects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.filter-selects label span {
  display: block;
  margin-bottom: 8px;
  color: #98a3b5;
  font-size: 12px;
}

.filter-selects select {
  width: 100%;
  height: 42px;
  padding: 0 10px;
  border: 1px solid #354054;
  border-radius: 8px;
  background: #0c111b;
  color: #f3f5f9;
}

.reset-button {
  margin-top: 14px;
  padding: 0 14px;
  font-size: 12px;
}

.results-section {
  margin-top: 30px;
}

.results-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.results-heading > span {
  color: #b8f36b;
  font-size: 12px;
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.exercise-card {
  min-width: 0;
}

.card-top {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-tag,
.difficulty-tag {
  padding: 5px 8px;
  border-radius: 6px;
  background: #253326;
  color: #b8f36b;
  font-size: 10px;
}

.difficulty-tag {
  background: #252f3d;
  color: #c3cede;
}

.exercise-card h3 {
  margin: 17px 0 8px;
  font-size: 15px;
  line-height: 1.6;
}

.exercise-purpose {
  min-height: 60px;
  margin: 0;
  color: #98a3b5;
  font-size: 12px;
  line-height: 1.8;
}

.card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 13px;
  border-top: 1px solid #293243;
  color: #c3cede;
  font-size: 10px;
}

.empty-state {
  padding: 35px 15px;
  border: 1px dashed #354054;
  border-radius: 12px;
  color: #98a3b5;
  text-align: center;
}

.empty-state button {
  padding: 10px 14px;
  border: 1px solid #354054;
  border-radius: 8px;
  background: #192231;
  color: #b8f36b;
}

@media (max-width: 480px) {
  .exercise-grid {
    grid-template-columns: 1fr;
  }

  .exercise-purpose {
    min-height: 0;
  }
}

.exercise-card {
  display: block;
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.exercise-card:hover {
  transform: translateY(-3px);
  border-color: #b8f36b;
}
</style>
