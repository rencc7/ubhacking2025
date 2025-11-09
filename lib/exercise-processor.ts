import { Exercise } from './workout-generator';

export function processExerciseData(exercise: Exercise) {
  let reps = null;
  let duration = undefined;
  let intervalWork = undefined;
  let intervalRest = undefined;

  // Handle reps that contain interval information
  if (typeof exercise.reps === 'string') {
    if (exercise.reps.toLowerCase().includes('rest') || exercise.reps.toLowerCase().includes('sprint')) {
      const pattern = /(\d+)\s*(?:seconds|s|mins?|minutes?)\s*(?:sprint|work)?,?\s*(\d+)\s*(?:seconds|s|mins?|minutes?)\s*rest/i;
      const match = exercise.reps.match(pattern);
      if (match) {
        intervalWork = parseInt(match[1]) * 60; // Convert to seconds
        intervalRest = parseInt(match[2]) * 60;
      }
    }
  } else if (typeof exercise.reps === 'number') {
    reps = exercise.reps;
  }

  // Handle duration
  if (typeof exercise.duration === 'string') {
    const pattern = /(\d+)\s*(minute|min|hour|hr|second|sec)s?/i;
    const match = exercise.duration.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      
      switch(unit) {
        case 'hour':
        case 'hr':
          duration = value * 3600;
          break;
        case 'minute':
        case 'min':
          duration = value * 60;
          break;
        case 'second':
        case 'sec':
          duration = value;
          break;
      }
    }
  } else if (typeof exercise.duration === 'number') {
    duration = exercise.duration;
  }

  return {
    name: exercise.name,
    type: exercise.type,
    muscleGroups: Array.isArray(exercise.muscleGroups) ? JSON.stringify(exercise.muscleGroups) : JSON.stringify([]),
    instructions: exercise.instructions,
    sets: typeof exercise.sets === 'number' ? exercise.sets : null,
    reps,
    duration,
    intervalWork,
    intervalRest,
  };
}