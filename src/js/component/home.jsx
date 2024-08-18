import React, { useState, useEffect } from "react";

const Home = () => {
  const apiUrl = 'https://playground.4geeks.com/todo';
  const [user, setUser] = useState('Ruubia');
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  function getTasks() {
    fetch(`${apiUrl}/users/${user}`)
      .then(response => response.json())
      .then(data => {
        if (data.todos) {
          setTasks(data.todos);
        } else {
          setTasks([]);
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      });
  }

  function createUser() {
    fetch(`${apiUrl}/users/${user}`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        // Handle successful user creation if needed
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  }

  function createTask(task) {
    fetch(`${apiUrl}/todos/${user}`, {
      method: 'POST',
      body: JSON.stringify({
        "label": task,
        "is_done": false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setInput('');
          getTasks();
        }
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });
  }

  function deleteTask(id) {
    fetch(`${apiUrl}/todos/${id}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          getTasks();
        } else {
          response.json().then(data => {
            console.error('Error deleting task:', data);
          });
        }
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  }

  useEffect(() => {
    createUser();
    getTasks();
  }, []);

  const addTask = (e) => {
    if (e.key === 'Enter' && input) {
      createTask(input);
    }
  };

  return (

     <div className="container d-flex justify-content-center border w-25 mx-auto my-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <div className="card w-50 mt-5">
        <div className="card-body">
          <h1 className="text-center text-muted mb-4">todos</h1>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={addTask} // Agregar tarea al presionar Enter
          />
          <ul className="list-group">
            {tasks.length === 0 ? (
              <li className="list-group-item text-center text-muted">
                No tasks, add tasks
              </li>
            ) : (
              tasks.map((task) => (
                <li
                  key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {task.label}
                  <span
                    className="deleteIcon mx-3 fz-1"
                    onClick={() => deleteTask(task.id)}
                  >
                    x
                  </span>
                </li>
              ))
            )}
          </ul>
          <div className="mt-3 text-muted">
            {tasks.length} item{tasks.length !== 1 ? 's' : ''} left
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


