import React, { useState } from 'react';
import '../../styles/teacher/MainContent.css';
import jsPDF from 'jspdf';

const MainContent = ({ activePage, selectedStudent }) => {
  const [showPerformanceGraph, setShowPerformanceGraph] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Sample parent data for each student
  const studentParents = {
    'Alice Johnson': { name: 'John Johnson', email: 'john.johnson@email.com' },
    'Bob Smith': { name: 'Mary Smith', email: 'mary.smith@email.com' },
    'Carol Davis': { name: 'David Davis', email: 'david.davis@email.com' },
    'David Wilson': { name: 'Lisa Wilson', email: 'lisa.wilson@email.com' },
    'Emma Brown': { name: 'Robert Brown', email: 'robert.brown@email.com' },
    'Frank Miller': { name: 'Susan Miller', email: 'susan.miller@email.com' }
  };


  const handleShowPerformanceGraph = () => {
    setShowPerformanceGraph(true);
  };

  const handleClosePerformanceGraph = () => {
    setShowPerformanceGraph(false);
  };

  const handleSendMessageToParent = () => {
    if (selectedStudent) {
      setShowMessageModal(true);
    }
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setMessageText('');
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const parent = studentParents[selectedStudent.name];
      console.log('Sending message to parent:', parent.name, 'Message:', messageText);
      alert(`Message sent to ${parent.name} (${parent.email})!`);
      setMessageText('');
      setShowMessageModal(false);
    } else {
      alert('Please enter a message.');
    }
  };

  const generateReport = () => {
    if (!selectedStudent) return;

    const doc = new jsPDF();
    
    // Set up the document
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Performance Report', 105, 20, { align: 'center' });
    
    // Student information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information:', 20, 40);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${selectedStudent.name}`, 20, 50);
    doc.text(`Current Grade: ${selectedStudent.grade}`, 20, 60);
    doc.text(`Status: ${selectedStudent.present ? 'Present Today' : 'Absent Today'}`, 20, 70);
    
    // Quiz Performance Data
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Quiz Performance Over Time:', 20, 90);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Week 1: 85%', 20, 100);
    doc.text('Week 2: 92%', 20, 110);
    doc.text('Week 3: 78%', 20, 120);
    doc.text('Week 4: 95%', 20, 130);
    
    // Emotional Progress
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Emotional Progress:', 20, 150);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Happy: 90%', 20, 160);
    doc.text('Neutral: 8%', 20, 170);
    doc.text('Upset: 2%', 20, 180);
    
    // Overall Progress Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Progress Summary:', 20, 200);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Academic Performance: Excellent', 20, 210);
    doc.text('Emotional Well-being: Very Good', 20, 220);
    doc.text('Engagement Level: High', 20, 230);
    
    // Additional details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Consistent improvement in quiz scores', 20, 240);
    doc.text('Positive emotional state maintained', 20, 245);
    doc.text('Active participation in sessions', 20, 250);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 20, 270);
    
    // Save the PDF
    const fileName = `${selectedStudent.name.replace(/\s+/g, '_')}_Performance_Report.pdf`;
    doc.save(fileName);
    
    alert('Report generated successfully!');
  };

  const renderHomeContent = () => (
    <div className="home-content">
      <div className="welcome-section">
        <h1>Welcome back, Ms. Johnson!</h1>
        <p>Here's what's happening in your classroom today.</p>
      </div>
      
      <div className="content-grid">
        <div className="content-card">
          <h3>Today's Overview</h3>
          <div className="overview-stats">
            <div className="overview-item">
              <span className="overview-number">24</span>
              <span className="overview-label">Students Enrolled in an active ITZ session </span>
            </div>
            <div className="overview-item">
              <span className="overview-number">24</span>
              <span className="overview-label">No. of Students Completed session</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <span className="activity-text">Students completed quiz #1-3</span>
              <span className="activity-time">2 min ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🆘</span>
              <span className="activity-text">Alice has called for help</span>
              <span className="activity-time">1 min ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🚨</span>
              <span className="activity-text">James failed check of understanding quiz
              </span>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="student-dashboard-content">
      <div className="content-header">
        <h1>Student Details</h1>
        <button className="back-btn" onClick={() => window.location.reload()}>← Back to Home</button>
      </div>
      
      {selectedStudent && (
        <div className="student-profile-section">
          <div className="student-profile-header">
            <div className="student-profile-photo">
              <img src={selectedStudent.image} alt={selectedStudent.name} />
              <div className={`attendance-badge ${selectedStudent.present ? 'present' : 'absent'}`}>
                {selectedStudent.present ? 'Present' : 'Absent'}
              </div>
            </div>
            <div className="student-profile-info">
              <h2>{selectedStudent.name}</h2>
              <p className="student-grade">Current Grade: {selectedStudent.grade}</p>
              <p className="student-status">Status: {selectedStudent.present ? 'Present Today' : 'Absent Today'}</p>
            </div>
          </div>
          
          <div className="student-stats-grid">
            <div className="stat-card">
              <h3>Quizes Completed</h3>
              <div className="stat-value">{selectedStudent.present ? '4/4' : '0/4'}</div>
              <div className="stat-label">Completed</div>
            </div>
            
            <div className="stat-card">
              <h3>Student Performance</h3>
              <div className="stat-value">{selectedStudent.present ? 'Excellent' : 'Good'}</div>
              <div className="stat-label">Class Engagement</div>
            </div>
            
            <div className="stat-card">
              <h3>Emotional Progress</h3>
              <div className="stat-value">Happy</div>
              <div className="stat-label">No Issues</div>
            </div>
          </div>
          
          <div className="student-actions">
            <button className="action-button primary" onClick={handleSendMessageToParent}>Send Message to Parent</button>
            <button className="action-button secondary">Schedule Meeting</button>
            <button className="action-button secondary" onClick={handleShowPerformanceGraph}>View Performance Graph</button>
          </div>
        </div>
      )}

      {/* Performance Graph Modal */}
      {showPerformanceGraph && selectedStudent && (
        <div className="performance-modal-overlay">
          <div className="performance-modal">
            <div className="modal-header">
              <h3>{selectedStudent.name} - Performance Graph</h3>
              <button className="close-button" onClick={handleClosePerformanceGraph}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="performance-charts">
                <div className="chart-section">
                  <h4>Quiz Performance Over Time</h4>
                  <div className="performance-chart">
                    <div className="line-chart">
                      <svg width="100%" height="200" viewBox="0 0 400 200">
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="400" y2="40" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="0" y1="80" x2="400" y2="80" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="0" y1="120" x2="400" y2="120" stroke="#e0e0e0" strokeWidth="1"/>
                        <line x1="0" y1="160" x2="400" y2="160" stroke="#e0e0e0" strokeWidth="1"/>
                        
                        {/* Y-axis labels */}
                        <text x="10" y="45" fontSize="12" fill="#666">100%</text>
                        <text x="10" y="85" fontSize="12" fill="#666">75%</text>
                        <text x="10" y="125" fontSize="12" fill="#666">50%</text>
                        <text x="10" y="165" fontSize="12" fill="#666">25%</text>
                        
                        {/* Data points and line */}
                        <circle cx="50" cy="24" r="4" fill="#4CAF50"/>
                        <circle cx="150" cy="16" r="4" fill="#4CAF50"/>
                        <circle cx="250" cy="44" r="4" fill="#4CAF50"/>
                        <circle cx="350" cy="10" r="4" fill="#4CAF50"/>
                        
                        {/* Line connecting points */}
                        <path d="M 50 24 L 150 16 L 250 44 L 350 10" stroke="#4CAF50" strokeWidth="3" fill="none"/>
                        
                        {/* X-axis labels */}
                        <text x="50" y="190" fontSize="12" fill="#666" textAnchor="middle">Week 1</text>
                        <text x="150" y="190" fontSize="12" fill="#666" textAnchor="middle">Week 2</text>
                        <text x="250" y="190" fontSize="12" fill="#666" textAnchor="middle">Week 3</text>
                        <text x="350" y="190" fontSize="12" fill="#666" textAnchor="middle">Week 4</text>
                        
                        {/* Percentage labels on points */}
                        <text x="50" y="15" fontSize="10" fill="#4CAF50" textAnchor="middle">85%</text>
                        <text x="150" y="7" fontSize="10" fill="#4CAF50" textAnchor="middle">92%</text>
                        <text x="250" y="35" fontSize="10" fill="#4CAF50" textAnchor="middle">78%</text>
                        <text x="350" y="1" fontSize="10" fill="#4CAF50" textAnchor="middle">95%</text>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="chart-section">
                  <h4>Emotional Progress</h4>
                  <div className="emotion-chart">
                    <div className="emotion-indicators">
                      <div className="emotion-item">
                        <span className="emotion-emoji">😊</span>
                        <span className="emotion-label">Happy</span>
                        <div className="emotion-bar">
                          <div className="emotion-fill" style={{ width: '90%' }}></div>
                        </div>
                        <span className="emotion-percentage">90%</span>
                      </div>
                      <div className="emotion-item">
                        <span className="emotion-emoji">😐</span>
                        <span className="emotion-label">Neutral</span>
                        <div className="emotion-bar">
                          <div className="emotion-fill" style={{ width: '8%' }}></div>
                        </div>
                        <span className="emotion-percentage">8%</span>
                      </div>
                      <div className="emotion-item">
                        <span className="emotion-emoji">😟</span>
                        <span className="emotion-label">Upset</span>
                        <div className="emotion-bar">
                          <div className="emotion-fill" style={{ width: '2%' }}></div>
                        </div>
                        <span className="emotion-percentage">2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chart-section">
                  <h4>Overall Progress Summary</h4>
                  <div className="progress-summary">
                    <div className="summary-card">
                      <h5>Academic Performance</h5>
                      <div className="summary-value excellent">Excellent</div>
                      <p>Consistent improvement in quiz scores</p>
                    </div>
                    <div className="summary-card">
                      <h5>Emotional Well-being</h5>
                      <div className="summary-value good">Very Good</div>
                      <p>Positive emotional state maintained</p>
                    </div>
                    <div className="summary-card">
                      <h5>Engagement Level</h5>
                      <div className="summary-value excellent">High</div>
                      <p>Active participation in sessions</p>
                    </div>
                  </div>
                </div>

                <div className="performance-actions">
                  <button className="action-button secondary">View Grade</button>
                  <button className="action-button primary" onClick={generateReport}>Generate Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message to Parent Modal */}
      {showMessageModal && selectedStudent && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <div className="modal-header">
              <h3>Send Message to Parent</h3>
              <button className="close-button" onClick={handleCloseMessageModal}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="message-info">
                <p><strong>Student:</strong> {selectedStudent.name}</p>
                <p><strong>Parent:</strong> {studentParents[selectedStudent.name]?.name}</p>
                <p><strong>Email:</strong> {studentParents[selectedStudent.name]?.email}</p>
              </div>

              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message to the parent here..."
                  className="message-textarea"
                  rows="4"
                />
              </div>

              <div className="modal-buttons">
                <button className="cancel-button" onClick={handleCloseMessageModal}>
                  Cancel
                </button>
                <button className="send-button" onClick={handleSendMessage}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboardContent = () => (
    <div className="dashboard-content">
      <div className="content-header">
        <h1>Dashboard</h1>
        <div className="date-selector">
          <span>Last 30 days</span>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card large">
          <h3>Grade Distribution</h3>
          <div className="grade-chart">
            <div className="grade-bar">
              <span className="grade-label">A</span>
              <div className="grade-progress">
                <div className="grade-fill" style={{ width: '35%' }}></div>
              </div>
              <span className="grade-count">8 students</span>
            </div>
            <div className="grade-bar">
              <span className="grade-label">B</span>
              <div className="grade-progress">
                <div className="grade-fill" style={{ width: '45%' }}></div>
              </div>
              <span className="grade-count">11 students</span>
            </div>
            <div className="grade-bar">
              <span className="grade-label">C</span>
              <div className="grade-progress">
                <div className="grade-fill" style={{ width: '20%' }}></div>
              </div>
              <span className="grade-count">5 students</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Attendance Trend</h3>
          <div className="attendance-chart">
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '80%' }}></div>
            <div className="chart-bar" style={{ height: '75%' }}></div>
            <div className="chart-bar" style={{ height: '90%' }}></div>
            <div className="chart-bar" style={{ height: '85%' }}></div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Assignment Completion</h3>
          <div className="completion-stats">
            <div className="completion-item">
              <span className="completion-label">Completed</span>
              <span className="completion-value">18/24</span>
            </div>
            <div className="completion-item">
              <span className="completion-label">Pending</span>
              <span className="completion-value">6/24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="settings-content">
      <div className="content-header">
        <h1>Settings</h1>
      </div>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Profile Settings</h3>
          <div className="setting-item">
            <label>Display Name</label>
            <input type="text" defaultValue="Ms. Johnson" />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input type="email" defaultValue="teacher@school.edu" />
          </div>
          <div className="setting-item">
            <label>Subject</label>
            <select defaultValue="Mathematics">
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
            </select>
          </div>
        </div>

        <div className="settings-card">
          <h3>Notification Preferences</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked /> Email notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked /> Assignment reminders
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" /> Parent meeting alerts
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h3>Class Settings</h3>
          <div className="setting-item">
            <label>Default Grade Scale</label>
            <select defaultValue="A-F">
              <option>A-F</option>
              <option>0-100</option>
              <option>Pass/Fail</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Attendance Tracking</label>
            <select defaultValue="Automatic">
              <option>Automatic</option>
              <option>Manual</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return renderHomeContent();
      case 'student-dashboard':
        return renderStudentDashboard();
      case 'dashboard':
        return renderDashboardContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="teacher-dashboard-main-content">
      {renderContent()}
    </div>
  );
};

export default MainContent;