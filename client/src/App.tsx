import React, { useEffect, useState } from 'react';
import './App.css';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

type DayData = {
  exercises?: string[];
  diet?: string[];
};

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function App() {
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [data, setData] = useState<DayData>({});
  const [exerciseInput, setExerciseInput] = useState('');
  const [dietInput, setDietInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    fetch(`/api/day/${selectedDay}`)
      .then(res => res.json())
      .then((d) => {
        setData({
          exercises: Array.isArray(d.exercises) ? d.exercises : d.exercises ? [d.exercises] : [],
          diet: Array.isArray(d.diet) ? d.diet : d.diet ? [d.diet] : [],
        });
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [selectedDay]);

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseInput.trim()) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    const newExercises = [...(data.exercises || []), exerciseInput.trim()];
    fetch(`/api/day/${selectedDay}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, exercises: newExercises }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed');
        setData(prev => ({ ...prev, exercises: newExercises }));
        setSuccess('Exercise added!');
        setExerciseInput('');
      })
      .catch(() => setError('Failed to save data'))
      .finally(() => setSaving(false));
  };

  const handleAddDiet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietInput.trim()) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    const newDiet = [...(data.diet || []), dietInput.trim()];
    fetch(`/api/day/${selectedDay}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, diet: newDiet }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed');
        setData(prev => ({ ...prev, diet: newDiet }));
        setSuccess('Dish added!');
        setDietInput('');
      })
      .catch(() => setError('Failed to save data'))
      .finally(() => setSaving(false));
  };

  return (
    <div className="fancy-app-bg">
      <div className="fancy-container">
        <h1 className="fancy-title">🏋️‍♂️ Gym Scheduler</h1>
        <div className="fancy-days-bar">
          {DAYS.map(day => (
            <button
              key={day}
              className={`fancy-day-btn${selectedDay === day ? ' selected' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {capitalize(day)}
            </button>
          ))}
        </div>
        <div className="fancy-content">
          {loading ? (
            <p className="fancy-loading">Loading...</p>
          ) : (
            <>
              <div className="fancy-saved-data">
                <h2>Saved Data for {capitalize(selectedDay)}</h2>
                <div className="fancy-saved-block">
                  <strong>Exercises:</strong>
                  <ul className="fancy-saved-list">
                    {(data.exercises && data.exercises.length > 0) ? (
                      data.exercises.map((ex, idx) => <li key={idx}>{ex}</li>)
                    ) : (
                      <span className="fancy-empty">No exercises saved.</span>
                    )}
                  </ul>
                </div>
                <div className="fancy-saved-block">
                  <strong>Diet:</strong>
                  <ul className="fancy-saved-list">
                    {(data.diet && data.diet.length > 0) ? (
                      data.diet.map((d, idx) => <li key={idx}>{d}</li>)
                    ) : (
                      <span className="fancy-empty">No diet saved.</span>
                    )}
                  </ul>
                </div>
              </div>
              <form className="fancy-form" onSubmit={handleAddExercise} style={{ marginBottom: 16 }}>
                <h2>Add Exercise</h2>
                <div className="fancy-form-group">
                  <input
                    type="text"
                    name="exercise"
                    value={exerciseInput}
                    onChange={e => setExerciseInput(e.target.value)}
                    className="fancy-input"
                    placeholder="e.g. Bicep curls"
                  />
                </div>
                <button type="submit" className="fancy-save-btn" disabled={saving || !exerciseInput.trim()}>
                  {saving ? 'Saving...' : 'Add Exercise'}
                </button>
              </form>
              <form className="fancy-form" onSubmit={handleAddDiet}>
                <h2>Add Dish</h2>
                <div className="fancy-form-group">
                  <input
                    type="text"
                    name="diet"
                    value={dietInput}
                    onChange={e => setDietInput(e.target.value)}
                    className="fancy-input"
                    placeholder="e.g. Fish"
                  />
                </div>
                <button type="submit" className="fancy-save-btn" disabled={saving || !dietInput.trim()}>
                  {saving ? 'Saving...' : 'Add Dish'}
                </button>
                {error && <p className="fancy-error">{error}</p>}
                {success && <p className="fancy-success">{success}</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
