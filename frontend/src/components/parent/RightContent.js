import React, { useState } from 'react';
import '../../styles/parent/RightContent.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const sampleData = [
  { name: 'Mon', overall: 80, session: 60 },
  { name: 'Tue', overall: 78, session: 65 },
  { name: 'Wed', overall: 82, session: 70 },
  { name: 'Thu', overall: 85, session: 50 },
  { name: 'Fri', overall: 88, session: 75 },
  { name: 'Sat', overall: 90, session: 80 },
  { name: 'Sun', overall: 92, session: 85 },
];

const barData = [
  { subject: 'Math', score: 88 },
  { subject: 'Science', score: 92 },
  { subject: 'English', score: 85 },
  { subject: 'History', score: 80 },
  { subject: 'Art', score: 95 },
];

const barColors = ['#82ca9d', '#8884d8', '#ffc658', '#ff7f7f', '#8dd1e1'];

// Sample events data
const sampleEvents = {
  '2025-07-15': { type: 'meeting', title: 'Parent Meeting', color: '#ff6b6b' },
  '2025-07-20': { type: 'therapy', title: 'Speech Therapy', color: '#4ecdc4' },
  '2025-07-25': { type: 'assessment', title: 'Progress Assessment', color: '#45b7d1' },
  '2025-07-30': { type: 'meeting', title: 'IEP Review', color: '#96ceb4' },
};

const DynamicCalendar = ({ selectedDate, onDateSelect, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Adjust for Monday as first day of week
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const days = [];
    
    // Add previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = adjustedStartingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === new Date().toDateString()
      });
    }
    
    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventForDate = (date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey];
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateYear = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="dynamic-calendar">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={() => navigateYear(-1)} className="nav-btn">«</button>
          <button onClick={() => navigateMonth(-1)} className="nav-btn">‹</button>
        </div>
        <h2 className="calendar-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="calendar-nav">
          <button onClick={() => navigateMonth(1)} className="nav-btn">›</button>
          <button onClick={() => navigateYear(1)} className="nav-btn">»</button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {days.map((day, index) => {
            const event = getEventForDate(day.date);
            const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
            
            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}`}
                onClick={() => onDateSelect(day.date)}
              >
                <span className="day-number">{day.date.getDate()}</span>
                {event && (
                  <div 
                    className="event-indicator"
                    style={{ backgroundColor: event.color }}
                    title={event.title}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="calendar-controls">
        <button 
          className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
          onClick={() => setViewMode('day')}
        >
          Day View
        </button>
        <button 
          className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
          onClick={() => setViewMode('week')}
        >
          Week View
        </button>
        <button className="reminder-btn">
          Set reminders
        </button>
      </div>
    </div>
  );
};

const RightContent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState(sampleEvents);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // You can add additional logic here for date selection
    console.log('Selected date:', date);
  };

  return (
    <div className="parent-right-content"> 
      <div className="right-board-layout">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '20px', gap: '1rem' }}>
          {/* Left Column - Charts */}
          <div style={{ flex: 0.4, minWidth: 0, maxWidth: '400px' }}>
            {/* Weekly Performance Section */}
            <div className="stacked-section" style={{ background: '#e8f5e9', border: '2px solid #d8c9ab', borderRadius: '8px', padding: '20px', minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333', textAlign: 'center', fontSize: '1.1rem' }}>Weekly Performance</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={sampleData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis domain={[50, 100]} stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      borderRadius: 8, 
                      border: '1px solid #d8c9ab',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    name="Overall Performance" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10b981' }} 
                    activeDot={{ r: 6, fill: '#10b981' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="session" 
                    name="Today's Session" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#8b5cf6' }} 
                    activeDot={{ r: 6, fill: '#8b5cf6' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Subject-wise Performance Section */}
            <div className="stacked-section" style={{ background: '#f0f4ff', border: '2px solid #d8c9ab', borderRadius: '8px', padding: '20px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333', textAlign: 'center', fontSize: '1.1rem' }}>Subject-wise Performance</h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="subject" stroke="#666" fontSize={11} />
                  <YAxis domain={[70, 100]} stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      borderRadius: 8, 
                      border: '1px solid #d8c9ab',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rewards Section */}
            <div className="stacked-section" style={{ background: '#fff5f5', border: '2px solid #d8c9ab', borderRadius: '8px', padding: '20px', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '0' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333', textAlign: 'center', fontSize: '1.1rem' }}>Rewards</h3>
              
              {/* Sticker Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '0.5rem',
                marginBottom: '0.8rem'
              }}>
                {/* Earned Stickers */}
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#fff',
                  borderRadius: '6px',
                  border: '2px solid #10b981',
                  cursor: 'pointer'
                }} onClick={() => console.log('Star sticker clicked')}>
                  ⭐
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#fff',
                  borderRadius: '6px',
                  border: '2px solid #10b981',
                  cursor: 'pointer'
                }} onClick={() => console.log('Heart sticker clicked')}>
                  ❤️
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#fff',
                  borderRadius: '6px',
                  border: '2px solid #10b981',
                  cursor: 'pointer'
                }} onClick={() => console.log('Trophy sticker clicked')}>
                  🏆
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#fff',
                  borderRadius: '6px',
                  border: '2px solid #10b981',
                  cursor: 'pointer'
                }} onClick={() => console.log('Fire sticker clicked')}>
                  🔥
                </div>
                
                {/* Locked Stickers */}
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  border: '2px solid #d1d5db',
                  opacity: '0.5',
                  cursor: 'pointer'
                }} onClick={() => console.log('Locked sticker clicked')}>
                  🎯
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  border: '2px solid #d1d5db',
                  opacity: '0.5',
                  cursor: 'pointer'
                }} onClick={() => console.log('Locked sticker clicked')}>
                  🌟
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  border: '2px solid #d1d5db',
                  opacity: '0.5',
                  cursor: 'pointer'
                }} onClick={() => console.log('Locked sticker clicked')}>
                  🎨
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  textAlign: 'center',
                  padding: '0.3rem',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  border: '2px solid #d1d5db',
                  opacity: '0.5',
                  cursor: 'pointer'
                }} onClick={() => console.log('Locked sticker clicked')}>
                  🚀
                </div>
              </div>

              {/* Progress Info */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: '#666' }}>4/8 stickers earned</span>
                <button style={{
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }} onClick={() => console.log('View all stickers clicked')}>
                  View All
                </button>
              </div>
            </div>

          </div>
          

          {/* Middle Column - Reports */}
          <div style={{ flex: 0.35, display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '350px' }}>
            {/* Behavior Report Section */}
            <div className="report-section">
              <div className="section-header" onClick={() => console.log('Behavior Report clicked')}>
                <span className="section-icon">📋</span>
                <span className="section-title">Behavior Report</span>
                <span className="section-arrow">›</span>
              </div>
              <div className="section-content">
                <div className="clickable-item" onClick={() => console.log('Positive behaviors clicked')}>
                  <span className="item-icon">✅</span>
                  <span className="item-text">Positive behaviors</span>
                  <span className="item-count">12</span>
                </div>
                <div className="clickable-item" onClick={() => console.log('Interventions clicked')}>
                  <span className="item-icon">🎯</span>
                  <span className="item-text">Interventions</span>
                  <span className="item-count">5</span>
                </div>
              </div>
            </div>

            {/* Performance Snapshots Section */}
            <div className="report-section">
              <div className="section-header" onClick={() => console.log('Performance Snapshots clicked')}>
                <span className="section-icon">📊</span>
                <span className="section-title">Performance Snapshots</span>
                <span className="section-arrow">›</span>
              </div>
              <div className="section-content">
                <div className="clickable-item" onClick={() => console.log('Grades clicked')}>
                  <span className="item-icon">📈</span>
                  <span className="item-text">Grades</span>
                  <span className="item-status">Updated</span>
                </div>
                <div className="clickable-item" onClick={() => console.log('Engagement clicked')}>
                  <span className="item-icon">🎯</span>
                  <span className="item-text">Engagement insights</span>
                  <span className="item-status">High</span>
                </div>
              </div>
            </div>

            {/* Progress Updates Section */}
            <div className="report-section">
              <div className="section-header" onClick={() => console.log('Progress Updates clicked')}>
                <span className="section-icon">🎯</span>
                <span className="section-title">Progress Updates</span>
                <span className="section-arrow">›</span>
              </div>
              <div className="section-content">
                <div className="clickable-item" onClick={() => console.log('Academic Goals clicked')}>
                  <span className="item-icon">📚</span>
                  <span className="item-text">Academic Goals</span>
                  <span className="item-progress">75%</span>
                </div>
                <div className="clickable-item" onClick={() => console.log('Behavioral Goals clicked')}>
                  <span className="item-icon">🧠</span>
                  <span className="item-text">Behavioral Goals</span>
                  <span className="item-progress">88%</span>
                </div>
                <div className="clickable-item" onClick={() => console.log('Progress Report clicked')}>
                  <span className="item-icon">📊</span>
                  <span className="item-text">Progress Report</span>
                  <span className="item-status available">Download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Third Column - Tools */}
          <div style={{ flex: 0.25, display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '280px' }}>
            {/* Schedule Section */}
            <div style={{ marginTop: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem', width: '100%' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#ffffff' }}> Schedule: </span>
              </div>
              <DynamicCalendar 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                events={events}
              />
            </div>

            {/* Resource Library */}
            <div className="report-section" style={{ marginTop: '1.5rem' }}>
              <div className="section-header" onClick={() => console.log('Resource Library clicked')}>
                <span className="section-icon">📚</span>
                <span className="section-title">Resource Library</span>
                <span className="section-arrow">›</span>
              </div>
              <div className="section-content">
                <a href="https://www.understood.org/en/articles/the-difference-between-ieps-and-504-plans" target="_blank" rel="noopener noreferrer" className="clickable-item resource-link">
                  <span className="item-icon">📋</span>
                  <span className="item-text">IEPs/504s Guides</span>
                  <span className="item-status available">Available</span>
                </a>
                <a href="https://www.teachervision.com/teaching-strategies" target="_blank" rel="noopener noreferrer" className="clickable-item resource-link">
                  <span className="item-icon">💡</span>
                  <span className="item-text">Recommended Strategies</span>
                  <span className="item-status new">New</span>
                </a>
                <a href="https://www.schoolcommunitynetwork.org/resources" target="_blank" rel="noopener noreferrer" className="clickable-item resource-link">
                  <span className="item-icon">🏫</span>
                  <span className="item-text">School & Community</span>
                  <span className="item-status updated">Updated</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightContent;