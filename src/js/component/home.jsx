import React, { useState, useEffect } from "react";

const Home = () => {
  const apiUrl = 'https://playground.4geeks.com/todo';
  const [user, setUser] = useState('Ruubia');
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null); // Estado para manejar la edición
  const [editInput, setEditInput] = useState(""); // Estado para almacenar el valor del input de edición

  function getTasks() {
    fetch(`${apiUrl}/users/${user}`)
      .then(response => response.json())
      .then(data => {
        if (data.todos) {
          setTasks(data.todos);
        } else {
          setTasks([]);
        }
      } else {
        createUser().then(() => getTasks());
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

  function updateTask(id, updatedLabel) {
    fetch(`${apiUrl}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        "label": updatedLabel,
        "is_done": false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setEditingTaskId(null); // Salir del modo de edición
          getTasks();
        }
      })
      .catch(error => {
        console.error('Error updating task:', error);
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

  const handleEdit = (e, taskId) => {
    if (e.key === 'Enter' && editInput) {
      updateTask(taskId, editInput);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center my-5">
      <h1 className="text-center text-muted mb-4">todos</h1>
      <div className="card w-50 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={addTask}
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
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyDown={(e) => handleEdit(e, task.id)}
                      className="form-control"
                    />
                  ) : (
                    <>
                      {task.label}
                      <div className="d-flex">
                      <span
                        className="editIcon mx-2"
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditInput(task.label);
                        }}
                      >
                        ✏️
                      </span>
                      <span
                        className="deleteIcon mx-2"
                        onClick={() => deleteTask(task.id)}
                      >
                        x
                      </span>
                      </div>
                    </>
                  )}
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


