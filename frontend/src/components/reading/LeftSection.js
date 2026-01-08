import React, { useState } from 'react';
import '../../styles/reading/LeftSection.css';
import Select from 'react-select';

const steps = [
  { message: 'START' },
  { message: 'GOOD GOING' },
  { message: 'YOU CAN DO IT' },
  { message: 'ALMOST THERE' },
  { message: 'FINISH STRONG!' }
];

const subjectOptions = [
  { value: 'maths', label: 'Maths' },
  { value: 'social-science', label: 'Social Science' },
  { value: 'physics', label: 'Physics' },
];

const topicOptions = {
  maths: [
    { value: 'algebra', label: 'Algebra', url: 'https://en.wikipedia.org/wiki/Algebra' },
    { value: 'geometry', label: 'Geometry', url: 'https://en.wikipedia.org/wiki/Geometry' },
    { value: 'calculus', label: 'Calculus', url: 'https://en.wikipedia.org/wiki/Calculus' },
  ],
  'social-science': [
    { value: 'history', label: 'History', url: 'https://en.wikipedia.org/wiki/History_of_the_United_States' },
    { value: 'geography', label: 'Geography', url: 'https://en.wikipedia.org/wiki/Geography_of_the_United_States' },
    { value: 'civics', label: 'Civics', url: 'https://en.wikipedia.org/wiki/Civics' },
  ],
  physics: [
    { value: 'mechanics', label: 'Mechanics', url: 'https://www.khanacademy.org/science/physics/forces-newtons-laws' },
    { value: 'optics', label: 'Optics', url: 'https://www.britannica.com/science/optics' },
    { value: 'thermodynamics', label: 'Thermodynamics', url: 'https://www.khanacademy.org/science/physics/thermodynamics' },
  ],
};

const LeftSection = ({ onTopicSelect, onStart }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleStart = () => {
    if (typeof onStart === 'function') onStart();
  };

  return (
    <div className="reading-left-section">
      <div className="subject-dropdown-container">
        <label htmlFor="subject-select" className="subject-label">
          <span role="img" aria-label="subject" style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>📚</span>
          Select Subject:
        </label>
        <Select
          inputId="subject-select"
          classNamePrefix="react-select"
          options={subjectOptions}
          placeholder="-- Choose a subject --"
          isSearchable={false}
          value={selectedSubject}
          onChange={option => {
            setSelectedSubject(option);
            setSelectedTopic(null);
          }}
          styles={{
            control: (base, state) => ({
              ...base,
              borderRadius: '10px',
              borderColor: state.isFocused ? '#667eea' : '#764ba2',
              boxShadow: state.isFocused ? '0 4px 16px rgba(102, 126, 234, 0.18)' : '0 2px 8px rgba(102, 126, 234, 0.13)',
              padding: '2px',
              minHeight: '48px',
              fontWeight: 600,
              fontSize: '1.1rem',
              background: 'linear-gradient(90deg, #f8f9fa 60%, #e9eefd 100%)',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? '#e0e0ff'
                : state.isFocused
                ? '#f3f6ff'
                : '#fff',
              color: state.isSelected ? '#764ba2' : '#222',
              fontWeight: state.isSelected ? 700 : 600,
              fontSize: '1.08rem',
              padding: '16px 18px',
              cursor: 'pointer',
            }),
            menu: (base) => ({
              ...base,
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
              zIndex: 20,
            }),
            singleValue: (base) => ({
              ...base,
              color: '#333',
              fontWeight: 700,
            }),
          }}
        />
      </div>
      {selectedSubject && (
        <div className="subject-dropdown-container">
          <label htmlFor="topic-select" className="subject-label">
            <span role="img" aria-label="topic" style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>📖</span>
            Select Topic:
          </label>
          <Select
            inputId="topic-select"
            classNamePrefix="react-select"
            options={topicOptions[selectedSubject.value]}
            placeholder="-- Choose a topic --"
            isSearchable={false}
            value={selectedTopic}
            onChange={option => {
              setSelectedTopic(option);
              if (onTopicSelect && option && option.url) {
                onTopicSelect(option.url);
              }
            }}
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: '10px',
                borderColor: state.isFocused ? '#667eea' : '#764ba2',
                boxShadow: state.isFocused ? '0 4px 16px rgba(102, 126, 234, 0.18)' : '0 2px 8px rgba(102, 126, 234, 0.13)',
                padding: '2px',
                minHeight: '48px',
                fontWeight: 600,
                fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #f8f9fa 60%, #e9eefd 100%)',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? '#e0e0ff'
                  : state.isFocused
                  ? '#f3f6ff'
                  : '#fff',
                color: state.isSelected ? '#764ba2' : '#222',
                fontWeight: state.isSelected ? 700 : 600,
                fontSize: '1.08rem',
                padding: '16px 18px',
                cursor: 'pointer',
              }),
              menu: (base) => ({
                ...base,
                borderRadius: '10px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
                zIndex: 20,
              }),
              singleValue: (base) => ({
                ...base,
                color: '#333',
                fontWeight: 700,
              }),
            }}
          />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
        <button onClick={handleStart} style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '10px', backgroundColor: '#2C5057', color: '#fff', border: '2px solid #2C5057', boxShadow: '0 2px 8px rgba(75,172,129,0.10)', cursor: 'pointer', letterSpacing: '1px' }}>
          START
        </button>
      </div>
    </div>
  );
};

export default LeftSection;