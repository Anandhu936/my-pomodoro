

import React, { useState, useEffect, useRef } from 'react';

export default function TaskSection() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [editText, setEditText] = useState('');
  
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addTask = () => {
    if (inputValue.trim()) {
      if (editTaskIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editTaskIndex].text = inputValue;
        setTasks(updatedTasks);
        setEditTaskIndex(null);
      } else {
        setTasks([...tasks, { text: inputValue, completed: false }]);
      }
      setInputValue('');
      setIsInputVisible(false);
      setIsShow(false);
    }
  };

  const startEditingTask = (index) => {
    setEditTaskIndex(index); // Enter edit mode
    setEditText(tasks[index].text); // Load current task text into the input
    setIsShow(false);
  };

  const saveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editText; // Save the new text
    setTasks(updatedTasks);
    setEditTaskIndex(null); // Exit edit mode
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setIsInputVisible(true);
  };

  const toggleDropdown = () => {
    setIsShow(prevState => !prevState);
  };

  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])


return (
    <>
      <div className="flex justify-center">
        {isInputVisible && (
          <div className="bg-[#000000A3] w-[284px] px-[12px] py-[8px] flex justify-between align-middle rounded-[8px] border-[0.6px] border-[#FFFFFF29]">
            <input
              className="w-full h-full bg-transparent text-white border-none outline-none resize-none text-center "
              type="text"
              placeholder="Add task..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
          </div>
        )}
        <div className="flex justify-center">
          <div className=" w-[full]">
            <ul className="list-none">
              {tasks.map((task, index) => (
                <li key={index} className="flex justify-center items-center   rounded-[6px] ">
                  <div className=" ">
                    <div className='group relative flex items-baseline gap-[15px]'>
                      <div>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(index)}
                          className={`w-[20px] h-[20px] ${task.completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            } transition-opacity duration-300`}
                        />
                      </div>

                      <div className='flex-grow'>
                        {editTaskIndex === index ? (
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={() => saveTask(index)}
                            onKeyDown={(e) => e.key === 'Enter' && saveTask(index)}
                            className="text-white text-[36px] bg-transparent border-none outline-none px-[10px]   "
                            style={{ width: `${Math.max(editText.length * 16, 150)}px` }}
                          />
                        ) : (
                          <span
                            onClick={() => startEditingTask(index)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                startEditingTask(index);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            className={`text-white text-[36px]  px-[10px] ${task.completed ? 'line-through' : ''}  `}
                          >
                            {task.text}
                          </span>
                        )}
                      </div >
                      <div className='relative'>
                        <button className=" opacity-0 group-hover:opacity-100 transition-opacity duration-300 " onClick={toggleDropdown}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 9.5625C9.46599 9.5625 9.84375 9.18474 9.84375 8.71875C9.84375 8.25276 9.46599 7.875 9 7.875C8.53401 7.875 8.15625 8.25276 8.15625 8.71875C8.15625 9.18474 8.53401 9.5625 9 9.5625Z"
                              stroke="#AAAAAA"
                              strokeWidth="2.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.9062 9.5625C15.3722 9.5625 15.75 9.18474 15.75 8.71875C15.75 8.25276 15.3722 7.875 14.9062 7.875C14.4403 7.875 14.0625 8.25276 14.0625 8.71875C14.0625 9.18474 14.4403 9.5625 14.9062 9.5625Z"
                              stroke="#AAAAAA"
                              strokeWidth="2.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3.09375 9.5625C3.55974 9.5625 3.9375 9.18474 3.9375 8.71875C3.9375 8.25276 3.55974 7.875 3.09375 7.875C2.62776 7.875 2.25 8.25276 2.25 8.71875C2.25 9.18474 2.62776 9.5625 3.09375 9.5625Z"
                              stroke="#AAAAAA"
                              strokeWidth="2.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {isShow && (
                          <div ref={dropdownRef} className="flex justify-center">
                            <div className="bg-[black] w-[250px] absolute left-[0px] rounded-[8px] top-[25px] ">
                              <ul className="pt-[10px]">
                                <li>
                                  <button
                                    onClick={() => startEditingTask(index)}
                                    className="flex items-center gap-[10px] pl-[10px] hover:bg-[#202020] w-[250px]"
                                  >
                                    <span>
                                      <svg
                                        className="fill-[gray]"
                                        viewBox="0 0 24 24"
                                        width={14}
                                        height={14}
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="M15.067 3.986a.5.5 0 0 0-.708-.001L3.437 14.91a.5.5 0 0 0 0 .707l4.948 4.948a.5.5 0 0 0 .707 0L20.009 9.648a.5.5 0 0 0 0-.706l-4.942-4.956zM2.43 16.8a.5.5 0 0 0-.84.237L.084 23.314a.501.501 0 0 0 .603.602l6.272-1.5a.5.5 0 0 0 .237-.84L2.43 16.8zM23.2 2.924L21.077.8a2.5 2.5 0 0 0-3.532 0l-1.418 1.417a.5.5 0 0 0 0 .707l4.95 4.949a.5.5 0 0 0 .707 0L23.2 6.454a2.5 2.5 0 0 0 0-3.53z"
                                        />
                                      </svg>
                                    </span>
                                    <span className="text-[20px] text-[gray]">Edit</span>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => deleteTask(index)}
                                    className="flex items-center gap-[10px] pl-[10px] hover:bg-[#202020] w-[250px]"
                                  >
                                    <span>
                                      <svg
                                        className="fill-[gray]"
                                        viewBox="0 0 212.982 212.982"
                                        width={14}
                                        height={14}
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          xmlns="http://www.w3.org/2000/svg"
                                          d="M131.804 106.491l75.936-75.936c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0L106.491 81.18 30.554 5.242c-6.99-6.99-18.322-6.99-25.312 0-6.989 6.99-6.989 18.323 0 25.312l75.937 75.936-75.937 75.937c-6.989 6.99-6.989 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0l75.937-75.937 75.937 75.937c6.989 6.99 18.322 6.99 25.312 0 6.99-6.99 6.99-18.322 0-25.312l-75.936-75.936z"
                                        />
                                      </svg>
                                    </span>
                                    <span className="text-[20px] text-[gray]">Clear</span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
