import { useState } from 'react';
import { CheckCircle2, Circle, Lock, Play, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Exercise {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'audio';
  duration?: string;
  url: string;
  completed: boolean;
}

interface WorkoutDay {
  day: number;
  title: string;
  exercises: Exercise[];
  completed: boolean;
  isToday: boolean;
  isLocked: boolean;
  notes?: string;
}

interface WeekModuleProps {
  weekNumber: number;
  title: string;
  description: string;
  progress: number;
  totalDays: number;
  days: WorkoutDay[];
}

export function WeekModule({ weekNumber, title, description, progress, totalDays, days }: WeekModuleProps) {
  const { updateUserProgress } = useAuth();
  const [expandedDay, setExpandedDay] = useState<number | null>(
    days.find(d => d.isToday)?.day || null
  );
  const [dayNotes, setDayNotes] = useState<{ [key: number]: string }>({});
  const [exerciseStates, setExerciseStates] = useState<{ [key: string]: boolean }>({});

  const toggleExercise = (exerciseId: string) => {
    setExerciseStates(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const markDayComplete = (day: number) => {
    updateUserProgress(day);
  };

  const handleNoteChange = (day: number, note: string) => {
    setDayNotes(prev => ({
      ...prev,
      [day]: note,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-primary/10 rounded-2xl p-8 border border-dark-border">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black text-xl">
            {weekNumber}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black mb-1">SEMANA {weekNumber}: {title}</h1>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{totalDays} treinos</span>
            <span className="text-primary font-bold">{Math.round(progress)}% completo</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-red-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const isExpanded = expandedDay === day.day;
          const allExercisesCompleted = day.exercises.every(
            (ex) => exerciseStates[ex.id] ?? ex.completed
          );

          return (
            <div
              key={day.day}
              className={`bg-dark-card border-2 rounded-xl overflow-hidden transition-all ${
                day.isToday
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : day.completed
                  ? 'border-accent-green/50'
                  : day.isLocked
                  ? 'border-dark-border opacity-60'
                  : 'border-dark-border'
              }`}
            >
              <button
                onClick={() => !day.isLocked && setExpandedDay(isExpanded ? null : day.day)}
                disabled={day.isLocked}
                className="w-full p-6 flex items-center gap-4 hover:bg-white/5 transition-colors disabled:cursor-not-allowed"
              >
                {day.completed ? (
                  <CheckCircle2 className="text-accent-green flex-shrink-0" size={28} />
                ) : day.isToday ? (
                  <div className="w-7 h-7 rounded-full bg-primary animate-pulse flex-shrink-0" />
                ) : day.isLocked ? (
                  <Lock className="text-gray-500 flex-shrink-0" size={28} />
                ) : (
                  <Circle className="text-gray-500 flex-shrink-0" size={28} />
                )}

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">
                      DIA {day.day} - {day.title}
                    </span>
                    {day.isToday && (
                      <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        HOJE
                      </span>
                    )}
                  </div>
                  {day.isLocked && (
                    <p className="text-sm text-gray-500">
                      Complete o dia anterior para desbloquear
                    </p>
                  )}
                </div>

                {!day.isLocked && (
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                )}
              </button>

              {isExpanded && !day.isLocked && (
                <div className="px-6 pb-6 space-y-4 animate-in">
                  {day.exercises.map((exercise) => {
                    const isCompleted = exerciseStates[exercise.id] ?? exercise.completed;

                    return (
                      <div
                        key={exercise.id}
                        className="flex items-start gap-3 p-4 bg-dark-bg rounded-lg"
                      >
                        <button
                          onClick={() => toggleExercise(exercise.id)}
                          className="mt-1 flex-shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="text-accent-green" size={20} />
                          ) : (
                            <Circle className="text-gray-500" size={20} />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold">{exercise.title}</h4>
                            {exercise.duration && (
                              <span className="text-sm text-gray-400 whitespace-nowrap">
                                ▶ {exercise.duration}
                              </span>
                            )}
                          </div>

                          <a
                            href={exercise.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary-light transition-colors"
                          >
                            <ExternalLink size={14} />
                            {exercise.type === 'video' ? 'Assistir vídeo' :
                             exercise.type === 'pdf' ? 'Baixar PDF' :
                             'Ouvir áudio'}
                          </a>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-4">
                    <label className="block text-sm font-semibold mb-2">
                      📝 Notas do Dia:
                    </label>
                    <textarea
                      value={dayNotes[day.day] || day.notes || ''}
                      onChange={(e) => handleNoteChange(day.day, e.target.value)}
                      placeholder="Como foi o treino? Alguma observação?"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary transition-colors"
                      rows={3}
                    />
                  </div>

                  {!day.completed && (
                    <button
                      onClick={() => markDayComplete(day.day)}
                      disabled={!allExercisesCompleted}
                      className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                        allExercisesCompleted
                          ? 'bg-accent-green hover:bg-accent-green/90 text-black hover:scale-105'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {allExercisesCompleted ? '✓ MARCAR DIA COMO COMPLETO' : 'Complete todos os exercícios primeiro'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-dark-card border border-accent-yellow/30 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          🎁 BÔNUS DA SEMANA {weekNumber}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
            <div className="flex items-center gap-3">
              <Play className="text-accent-yellow" size={20} />
              <span className="font-semibold">PDF: Guia da Semana {weekNumber}</span>
            </div>
            <button className="text-primary hover:text-primary-light font-semibold text-sm">
              BAIXAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
