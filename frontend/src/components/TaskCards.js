import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { FaArrowLeft, FaArrowRight,  FaTimes } from 'react-icons/fa';
import '../styles/TaskCards.css';

const TaskCards = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [tasksByMonth, setTasksByMonth] = useState({});
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decoded = jwtDecode(token);
    if (decoded.usertype !== 2) {
      alert('Please login again, for usertype confirmation');
      Cookies.remove('token');
      navigate('/login');
      return;
    }
    const userId = decoded.id;

    fetch(`http://localhost:3000/tasks/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setTasksByMonth(data);
        const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        setSelectedMonthYear(currentMonthYear);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, [navigate]);

  if (!Object.keys(tasksByMonth).length) {
    return <p>No tasks assigned</p>;
  }

  const handleBackClick = () => {
    navigate(`/dashboard/${username}`);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseClick = () => {
    setSelectedTask(null);
  };

  const handleDeleteProof = (proofId) => {
    const token = Cookies.get('token');
    fetch(`http://localhost:3000/proofs/${proofId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          alert('Proof file deleted successfully');
          setSelectedTask(prevTask => ({ ...prevTask, ProofID: null, ProofFile: null, ProofStatus: null }));
          const updatedTasksByMonth = { ...tasksByMonth };
          updatedTasksByMonth[selectedMonthYear] = updatedTasksByMonth[selectedMonthYear].map(task => 
            task.ProofID === proofId ? { ...task, ProofID: null, ProofFile: null, ProofStatus: null } : task
          );
          setTasksByMonth(updatedTasksByMonth);
        } else {
          alert('Failed to delete proof file');
        }
      })
      .catch(error => console.error('Error deleting proof file:', error));
  };

  const handleUploadProof = (taskId, taskName, taskDueDate) => {
    const encodedTaskId = btoa(taskId);
    const encodedTaskName = btoa(taskName);
    const encodedTaskDueDate = btoa(taskDueDate);
    navigate(`/upload-proof/${username}?wwtm=${encodedTaskId}&rtmn=${encodedTaskName}&tynr=${encodedTaskDueDate}`);
  };

  const decodeBase64 = (str) => {
    try {
      return atob(str);
    } catch (e) {
      console.error('Failed to decode base64 string:', e);
      return null;
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleMonthYearChange = (event) => {
    setSelectedMonthYear(event.target.value);
  };

  const getMonthYearsOptions = () => {
    return Object.keys(tasksByMonth).sort((a, b) => new Date(b) - new Date(a));
  };

  return (
    <div className='rtwrapper'>
      <h1 style={{color : 'royalblue' , textAlign : "center"}}>Tasks Assigned to you <hr style={{color : 'white'}}/></h1>
      <div className="back-arrow" onClick={handleBackClick}>
        <FaArrowLeft size={30} />
      </div>

      <div className="dropdowns">
        <select value={selectedMonthYear} onChange={handleMonthYearChange} >
          {getMonthYearsOptions().map(monthYear => (
            <option key={monthYear} value={monthYear} >{monthYear}</option>
          ))}
        </select>
      </div>

      {selectedMonthYear && tasksByMonth[selectedMonthYear] && (
     
     <div className="tasks-container">
     <div className="task-column" style={{ border: '7px solid #ddd', padding: '10px', borderRadius: '5px' }}>
       <h2 style={{ color: 'darkblue' }}>Not Started</h2>
       {tasksByMonth[selectedMonthYear].filter(task => task.Status === 'Not Started').length === 0 ? (
         <p style={{marginTop : "80px" , fontSize : "larger"}}>No tasks started</p>
       ) : (
         tasksByMonth[selectedMonthYear].filter(task => task.Status === 'Not Started').map(task => (
           <div key={task.TaskID} className="task-list-item" onClick={() => handleTaskClick(task)} style={{ color: getRandomColor() }}>
             <p><b>Project Name - {task.ProjectName}</b></p>
             <p><b>Milestone Name - {task.MilestoneName}</b></p>
             <p><b>Task Name - {task.TaskName}</b></p>
           </div>
         ))
       )}
     </div>
   
     <div className="task-column" style={{ border: '7px solid #ddd', padding: '10px', borderRadius: '5px' }}>
       <h2>In Progress</h2>
       {tasksByMonth[selectedMonthYear].filter(task => task.Status === 'In Progress').length === 0 ? (
         <p style={{marginTop : "80px" , fontSize : "larger"}}>No tasks in progress</p>
       ) : (
         tasksByMonth[selectedMonthYear].filter(task => task.Status === 'In Progress').map(task => (
           <div key={task.TaskID} className="task-list-item" onClick={() => handleTaskClick(task)} style={{ color: getRandomColor() }}>
             <p><b>Project Name - {task.ProjectName}</b></p>
             <p><b>Milestone Name - {task.MilestoneName}</b></p>
             <p><b>Task Name - {task.TaskName}</b></p>
           </div>
         ))
       )}
     </div>
   
     <div className="task-column" style={{ border: '7px solid #ddd', padding: '10px', borderRadius: '5px' }}>
       <h2 style={{ color: 'green' }}>Completed</h2>
       {tasksByMonth[selectedMonthYear].filter(task => task.Status === 'Completed').length === 0 ? (
         <p style={{marginTop : "80px" , fontSize : "larger"}}>No tasks Completed</p>
       ) : (
         tasksByMonth[selectedMonthYear].filter(task => task.Status === 'Completed').map(task => (
           <div key={task.TaskID} className="task-list-item" onClick={() => handleTaskClick(task)} style={{ color: getRandomColor() }}>
             <p><b>Project Name - {task.ProjectName}</b></p>
             <p><b>Milestone Name - {task.MilestoneName}</b></p>
             <p><b>Task Name - {task.TaskName}</b></p>
           </div>
         ))
       )}
     </div>
   </div>
   
   
      )}

      {selectedTask && (
        <div className="overlay">
          <div className="task-detail-card">
            <FaTimes 
              onClick={handleCloseClick} 
              className="close-button" 
              style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                cursor: 'pointer' 
              }} 
            />
            <h3>{selectedTask.TaskName}</h3>
            <p><b>Deadline:</b> {`${new Date(selectedTask.StartDate).toLocaleDateString()} - ${new Date(selectedTask.EndDate).toLocaleDateString()}`}</p>
            <p><b>Task Status:</b> {selectedTask.Status}</p>
            <p><b>Task Description:</b> {selectedTask.Description}</p>
            <p><b>Under Project:</b> {selectedTask.ProjectName}</p> 
            <p><b>Project Description:</b> {selectedTask.projectDescript}</p> 
            <p><b>Under Milestone:</b> {selectedTask.MilestoneName}</p> 
            <p><b>Milestone Description:</b> {selectedTask.milstoneDescript}</p> 

            
            {selectedTask.ProofID && selectedTask.ProofFile && (
              <div className="proof-details">
                <a
                  href={`http://localhost:3000/download/${decodeBase64(selectedTask.ProofFile)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-file-link"
                >
                  Download: {decodeBase64(selectedTask.ProofFile)}
                </a>
                <br/>
                {(selectedTask.ProofStatus === 'Rejected' || selectedTask.ProofStatus === 'Pending') && (
                  <button onClick={() => handleDeleteProof(selectedTask.ProofID)} className="upload" style={{backgroundColor : 'LightCoral' , width : '150px'}}>Delete Proof</button>
                )}
                <p><b>Proof Status:</b> {selectedTask.ProofStatus}</p>
                <p><b>Submitted On:</b> {new Date(selectedTask.SubmissionAt).toLocaleString()}</p>
              </div>
            )}

            {(selectedTask.Status === 'In Progress' || selectedTask.Status === 'Overdue') && (
              <button 
                onClick={() => handleUploadProof(selectedTask.TaskID, selectedTask.TaskName, selectedTask.EndDate)} 
                className="upload"
              >
                Upload Proof <FaArrowRight size={10}/>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCards;
