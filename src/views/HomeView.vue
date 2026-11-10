<script setup>
  import { computed, ref } from 'vue'
  import { exercises } from '../data/exercises.js'

  const position = ref('pitcher')
  const trainingStarted = ref(false)

  const positionName = computed(() =>
    position.value === 'pitcher' ? '투수' : '타자',
  )

  const todayTraining = computed(() =>
    exercises
      .filter((exercise) => exercise.position === position.value)
      .slice(0, 3)
      .map((exercise) => ({
        ...exercise,
        time: `${exercise.duration}분`,
      })),
  )

  function startTraining() {
    trainingStarted.value = true
  }
</script>


<template>
  <div class="app">
    <header class="header">
      <a class="logo" href="#" @click.prevent="trainingStarted = false">
        <span class="logo-icon">B</span>
        <span>BASE<span class="logo-light">LOG</span></span>
      </a>

      <span class="header-label">MY TRAINING</span>
    </header>

    <main class="main">
      <section class="welcome">
        <p class="eyebrow">YOUR BASEBALL JOURNEY</p>
        <h1>오늘도 한 단계,<br />더 성장하세요<span>.</span></h1>
        <p class="welcome-desc">
          꾸준한 훈련이 실력을 만듭니다.<br />
          오늘의 훈련을 시작해 보세요.
        </p>
      </section>

      <section class="position-section">
        <div class="section-heading">
          <h2>나의 포지션</h2>
          <span>POSITION</span>
        </div>

        <div class="position-switch">
          <button
            :class="{ active: position === 'pitcher' }"
            @click="position = 'pitcher'; trainingStarted = false"
          >
            <span class="position-symbol">↗</span>
            <span>
              <strong>투수</strong>
              <small>PITCHER</small>
            </span>
            <span class="select-mark">{{ position === 'pitcher' ? '✓' : '' }}</span>
          </button>

          <button
            :class="{ active: position === 'hitter' }"
            @click="position = 'hitter'; trainingStarted = false"
          >
            <span class="position-symbol">↗</span>
            <span>
              <strong>타자</strong>
              <small>HITTER</small>
            </span>
            <span class="select-mark">{{ position === 'hitter' ? '✓' : '' }}</span>
          </button>
        </div>
      </section>

      <section class="training-section">
        <div class="section-heading">
          <h2>오늘의 훈련</h2>
          <span>{{ positionName }} PROGRAM</span>
        </div>

        <div class="training-card">
          <div class="training-top">
            <div>
              <span class="today-badge">TODAY'S ROUTINE</span>
              <h3>{{ positionName }} 기본 훈련</h3>
              <p>기초부터 차근차근 시작해 보세요.</p>
            </div>
            <div class="baseball-icon">⚾</div>
          </div>

          <div class="training-list">
            <div
              v-for="(exercise, index) in todayTraining"
              :key="exercise.name"
              class="exercise-row"
            >
              <span class="exercise-number">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <div class="exercise-info">
                <strong>{{ exercise.name }}</strong>
                <small>{{ exercise.detail }}</small>
              </div>
              <span class="exercise-time">{{ exercise.time }}</span>
            </div>
          </div>

          <button class="start-button" @click="startTraining">
            {{ trainingStarted ? '훈련 목록을 확인했습니다 ✓' : '오늘의 훈련 시작하기' }}
            <span>→</span>
          </button>

          <p v-if="trainingStarted" class="start-message">
            훈련을 시작하기 전에 준비운동을 하고, 통증이 있다면 해당 운동을 중단하세요.
          </p>
        </div>
        <RouterLink to="/training" class="all-training-link">
          전체 훈련 보러 가기 <span>→</span>
        </RouterLink>
        <RouterLink to="/records" class="all-training-link">
          나의 훈련 기록 보기 <span>→</span>
        </RouterLink>
        <RouterLink to="/analytics" class="all-training-link">
          나의 훈련 분석 보기 <span>→</span>
        </RouterLink>

      </section>

      <section class="record-section">
        <div class="section-heading">
          <h2>나의 훈련 기록</h2>
          <span>MY RECORD</span>
        </div>

        <div class="record-card">
          <div class="record-icon">▤</div>
          <div class="record-copy">
            <strong>성장은 기록에서 시작됩니다.</strong>
            <p>훈련 기록 기능을 준비하고 있습니다.</p>
          </div>
          <span class="coming-soon">COMING SOON</span>
        </div>
      </section>

      <footer class="footer">
        <span>BASELOG</span>
        <p>TRAIN HARD. GROW EVERY DAY.</p>
      </footer>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'DM Sans', 'Noto Sans KR', sans-serif;
  color: #f3f5f9;
  background: #0c111b;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-optical-sizing: auto;
  font-weight: 400;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
a {
  font: inherit;
}

button {
  cursor: pointer;
}

.app {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% 0%, rgb(34 57 91 / 20%), transparent 48%),
    #0c111b;
}

.header {
  height: 76px;
  padding: 0 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #202837;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #f4f6fa;
  text-decoration: none;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.8px;
}

.logo-icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  background: #b8f36b;
  color: #111a11;
  font-size: 20px;
  font-weight: 800;
}

.logo-light {
  color: #b8f36b;
}

.header-label,
.section-heading > span {
  color: #8490a4;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.main {
  width: min(100% - 40px, 760px);
  margin: 0 auto;
}

.welcome {
  padding: 55px 0 38px;
}

.eyebrow {
  margin: 0 0 16px;
  color: #b8f36b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.welcome h1 {
  margin: 0;
  font-size: clamp(32px, 6vw, 46px);
  font-weight: 800;
  letter-spacing: -2.4px;
  line-height: 1.35;
}

.welcome h1 span {
  color: #b8f36b;
}

.welcome-desc {
  margin: 18px 0 0;
  color: #98a3b5;
  font-size: 14px;
  line-height: 1.9;
}

.position-section,
.training-section,
.record-section {
  margin-bottom: 34px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.section-heading h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.position-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.position-switch button {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 17px;
  text-align: left;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
  color: #dfe5ee;
  transition: border-color 0.2s, background 0.2s;
}

.position-switch button.active {
  border-color: #b8f36b;
  background: #1b2727;
}

.position-symbol {
  display: grid;
  flex: 0 0 39px;
  width: 39px;
  height: 39px;
  place-items: center;
  border-radius: 11px;
  background: #26323c;
  color: #b8f36b;
  font-size: 22px;
}

.position-switch strong,
.position-switch small {
  display: block;
}

.position-switch strong {
  font-size: 14px;
}

.position-switch small {
  margin-top: 4px;
  color: #8490a4;
  font-size: 9px;
  letter-spacing: 1px;
}

.select-mark {
  margin-left: auto;
  color: #b8f36b;
  font-size: 16px;
}

.training-card {
  overflow: hidden;
  border: 1px solid #293243;
  border-radius: 16px;
  background: #131a27;
}

.training-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 24px;
  border-bottom: 1px solid #293243;
}

.today-badge {
  color: #b8f36b;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.training-top h3 {
  margin: 10px 0 6px;
  font-size: 21px;
  letter-spacing: -0.7px;
}

.training-top p {
  margin: 0;
  color: #98a3b5;
  font-size: 12px;
}

.baseball-icon {
  display: grid;
  flex: 0 0 55px;
  width: 55px;
  height: 55px;
  place-items: center;
  border-radius: 16px;
  background: #252f3d;
  font-size: 29px;
}

.training-list {
  padding: 4px 24px;
}

.exercise-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 17px 0;
  border-bottom: 1px solid #252d3b;
}

.exercise-row:last-child {
  border-bottom: none;
}

.exercise-number {
  color: #b8f36b;
  font-size: 12px;
  font-weight: 700;
}

.exercise-info {
  flex: 1;
  min-width: 0;
}

.exercise-info strong,
.exercise-info small {
  display: block;
}

.exercise-info strong {
  font-size: 13px;
  font-weight: 600;
}

.exercise-info small {
  margin-top: 5px;
  color: #8c98aa;
  font-size: 11px;
}

.exercise-time {
  color: #c0c9d6;
  font-size: 11px;
  white-space: nowrap;
}

.start-button {
  display: flex;
  width: calc(100% - 48px);
  min-height: 49px;
  align-items: center;
  justify-content: space-between;
  margin: 8px 24px 24px;
  padding: 0 17px;
  border: none;
  border-radius: 9px;
  background: #b8f36b;
  color: #14200e;
  font-size: 13px;
  font-weight: 800;
  transition: background 0.2s;
}

.start-button:hover {
  background: #c9ff8a;
}

.start-button span {
  font-size: 19px;
}

.start-message {
  margin: -12px 24px 22px;
  color: #b8f36b;
  font-size: 11px;
  line-height: 1.7;
}

.record-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 19px;
  border: 1px solid #293243;
  border-radius: 13px;
  background: #131a27;
}

.record-icon {
  display: grid;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 10px;
  background: #26323c;
  color: #b8f36b;
  font-size: 22px;
}

.record-copy {
  flex: 1;
  min-width: 0;
}

.record-copy strong {
  font-size: 12px;
}

.record-copy p {
  margin: 6px 0 0;
  color: #8c98aa;
  font-size: 11px;
  line-height: 1.6;
}

.coming-soon {
  color: #8c98aa;
  font-size: 8px;
  letter-spacing: 0.8px;
  white-space: nowrap;
}

.footer {
  padding: 25px 0 35px;
  border-top: 1px solid #202837;
  text-align: center;
}

.footer span {
  color: #b8f36b;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

.footer p {
  margin: 8px 0 0;
  color: #778397;
  font-size: 9px;
  letter-spacing: 1.5px;
}

@media (min-width: 900px) {
  .main {
    padding-top: 10px;
  }

  .welcome {
    padding-top: 65px;
  }
}

@media (max-width: 480px) {
  .header {
    height: 65px;
    padding: 0 20px;
  }

  .header-label {
    font-size: 8px;
    letter-spacing: 1px;
  }

  .main {
    width: calc(100% - 32px);
  }

  .welcome {
    padding: 42px 0 32px;
  }

  .welcome h1 {
    letter-spacing: -1.8px;
  }

  .position-switch {
    gap: 8px;
  }

  .position-switch button {
    gap: 9px;
    padding: 12px 10px;
  }

  .position-symbol {
    flex-basis: 32px;
    width: 32px;
    height: 32px;
  }

  .training-top {
    padding: 20px 17px;
  }

  .training-list {
    padding: 4px 17px;
  }

  .start-button {
    width: calc(100% - 34px);
    margin: 8px 17px 20px;
  }

  .start-message {
    margin-right: 17px;
    margin-left: 17px;
  }

  .coming-soon {
    display: none;
  }
}

.all-training-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 16px 18px;
  border: 1px solid #293243;
  border-radius: 10px;
  color: #b8f36b;
  background: #131a27;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.all-training-link span {
  font-size: 18px;
}
</style>