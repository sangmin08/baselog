
const STORAGE_KEY = 'baselog-training-records'

// 전체 훈련 기록 가져오기
export function getTrainingRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

// 훈련 기록 저장하기

export function saveTrainingRecord(exercise, actualData = {}) {
  const records = getTrainingRecords()

  const newRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

    exerciseId: exercise.id,
    exerciseName: exercise.name,
    position: exercise.position,
    category: exercise.category,
    duration: exercise.duration,

    // 기존 운동 권장 정보
    sets: exercise.sets,
    reps: exercise.reps,

    // 사용자가 실제로 수행한 운동 기록
    actualSets: actualData.actualSets ?? null,
    actualReps: actualData.actualReps ?? null,
    rpe: actualData.rpe ?? null,

    completedAt: new Date().toISOString(),
  }

  records.unshift(newRecord)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  )

  return newRecord
}


// 기록 삭제하기
export function deleteTrainingRecord(id) {
  const records = getTrainingRecords()
  const updatedRecords = records.filter((record) => record.id !== id)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords))

  return updatedRecords
}
