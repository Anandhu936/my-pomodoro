import { useCallback, useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isButtonClick, setIsButtonClick] = useState(false);
  const [isButtonClickNextSession, setIsButtonClickNextSession] = useState(false);
  const [mode, setMode] = useState('focus');
  const [focusTime, setFocusTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [isShow, setIsShow] = useState(false);
  const [longBreakInterval, setLongBreakInterval] = useState(2);
  const [cycleCount, setCycleCount] = useState(0);

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
  }, []);

  const toggleDropdown = () => {
    setIsShow(prevState => !prevState);
  };

  const handleFocusChange = (event) => {
    const value = Number(event.target.value);
    setFocusTime(value);
    setTime(value * 60);
  };

  const handleShortBreakChange = (event) => {
    const value = Number(event.target.value);
    setShortBreak(value);
    setTime(value * 60);
  };

  const handleLongBreakChange = (event) => {
    const value = Number(event.target.value);
    setLongBreak(value);
    setTime(value * 60);
  };

  const handleLongBreakIntervalChange = (event) => {
    const value = Number(event.target.value);
    setLongBreakInterval(value);
  };

  const handleFocusClick = useCallback(() => {
    setTime(focusTime * 60);
    setMode('focus');
    setIsRunning(false);
  }, [focusTime]);

  const handleShortBreakClick = useCallback(() => {
    setTime(shortBreak * 60);
    setMode('shortBreak');
    setIsRunning(false);
  }, [shortBreak]);

  const handleLongBreakClick = useCallback(() => {
    setTime(longBreak * 60);
    setMode('longBreak');
    setIsRunning(false);
  }, [longBreak]);

  const handleStartClick = () => {
    setIsRunning(true);
  };

  const handlePauseClick = () => {
    setIsRunning(false);
  };

  const handleIncreaseTime = () => {
    setTime(prevTime => prevTime + 300);
  };

  const handleDecreaseTime = () => {
    setTime(prevTime => Math.max(0, prevTime - 300));
  };

  const handleButtonClick = () => {
    setIsButtonClick(prevState => !prevState);
  };

  useEffect(() => {
    if (isButtonClick && time === 0 && isRunning) {
      if (mode === 'focus') {
        handleShortBreakClick();
        setIsRunning(true);
      } else if (mode === 'shortBreak') {
        handleFocusClick();
        setIsRunning(false);
      }
    }
  }, [isButtonClick, time, isRunning, mode, handleShortBreakClick, handleFocusClick]);

  const handleButtonClickNextSession = () => {
    setIsButtonClickNextSession(prevState => !prevState);
  };

  useEffect(() => {
    if (isButtonClickNextSession && time === 0 && isRunning) {
      if (mode === 'focus') {
        const newCycleCount = cycleCount + 1;
        if (newCycleCount % longBreakInterval === 0) {
          handleLongBreakClick();
          setIsRunning(true);
        } else {
          handleShortBreakClick();
          setIsRunning(true);
        }
        setCycleCount(newCycleCount);
      } else if (mode === 'shortBreak' || mode === 'longBreak') {
        handleFocusClick();
        setIsRunning(true);
      }
    }
  }, [isButtonClickNextSession, time, isRunning, mode, cycleCount, longBreakInterval, handleLongBreakClick, handleShortBreakClick, handleFocusClick]);

  const handleResetClick = () => {
    switch (mode) {
      case 'focus':
        setTime(focusTime * 60);
        break;
      case 'shortBreak':
        setTime(shortBreak * 60);
        break;
      case 'longBreak':
        setTime(longBreak * 60);
        break;
      default:
        setTime(focusTime * 60);
    }
    setIsRunning(false);
  };

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (time > 0) {
          console.log('time', time);
          setTime(time - 1);
        } else {
          setIsRunning(false);
        }
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return (
    <>
      <div className="flex column justify-center align-middle">
        <div className="w-[450px] lg:w-[940px] " >
          <div className="pt-[30px] gap-[10px] flex   justify-center">
            <button className={`p-[8px_16px] border rounded-full text-base  ${mode === 'focus' ? 'bg-[#0079F9] border-[#3182CE] text-[#CBD5E0]' : 'border-[#FFFFFF3D] text-[#CBD5E0] hover:bg-[#202020]'}`} onClick={handleFocusClick} >Focus mode </button>
            <button className={`p-[8px_16px] border rounded-full text-base ${mode === 'shortBreak' ? 'bg-[#0079F9] border-[#3182CE] text-[#CBD5E0]' : 'border-[#FFFFFF3D] text-[#CBD5E0] hover:bg-[#202020]'}`} onClick={handleShortBreakClick}>Short break </button>
            <button className={`p-[8px_16px] border rounded-full text-base ${mode === 'longBreak' ? 'bg-[#0079F9] border-[#3182CE] text-[#CBD5E0]' : 'border-[#FFFFFF3D] text-[#CBD5E0] hover:bg-[#202020]'}`} onClick={handleLongBreakClick}>Long break </button>
          </div>
          <div className="overflow-hidden ">
            <div className="flex justify-center lg:mt-[85px] mb-[26px] relative  ">

              <div className="absolute top-[-30px] hidden lg:block"><svg className="dial-arrow" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14L0.205774 0.499999L15.7942 0.5L8 14Z" fill="white" />
              </svg>
              </div>
              <div className="relative  hidden lg:block">
                <div className={`flex  space-x-3 mx-auto  justify-center `}
                  style={{
                    transform: `translateX(${(-912 / 3600) * time + 456}px)`,
                    maskImage: `linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%), 
                          linear-gradient(to left, #fff 0%, rgba(255, 255, 255, 0) 100%)`,
                    maskSize: '100% 100%',
                    maskRepeat: 'no-repeat',
                  }}
                >
                  <div className="flex flex-col items-center  ">
                    <div className=" w-0.5 h-[70px] bg-[#e62f2f] "></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className=" w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>

                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white">0</span>
                  </div>
                  <div className="z-10 w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>

                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>

                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white">10</span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131]  "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]  "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]  "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]  "></div>
                  <div className="flex flex-col items-center ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white">20</span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white">30</span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white">40</span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131]"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white">50</span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] ]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] ]"></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white">60</span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="w-0.5 h-[45px] bg-[#313131] "></div>
                  <div className="flex flex-col items-center  ">
                    <div className="w-0.5 h-[70px] bg-[#e62f2f]"></div>
                    <span className="mt-1 w-2 text-white"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#C9C9C9CC]   mt-[10px]   gap-[46px] flex justify-center relative">
            <div className="flex relative group">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={handleResetClick}><svg className="opacity-70 hover:opacity-100 delay-300" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 8.00031V7.80029C14.5 6.12021 14.5 5.28016 14.173 4.63844C13.8854 4.07397 13.4265 3.61503 12.8621 3.3274C12.2204 3.00041 11.3803 3.00037 9.70023 3.00029L6.50098 3.00014C6.5002 3.00014 6.49981 3.00014 6.49949 3.00014C4.84309 3.00043 3.50036 4.34309 3.5 5.99949C3.5 5.99981 3.5 6.0002 3.5 6.00098V6.00098M14.5 8.00031L16.5 6.50098M14.5 8.00031L12.5 6.50098" stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 9.99969L3.5 10.1997C3.5 11.8798 3.5 12.7198 3.82696 13.3616C4.11456 13.926 4.57348 14.385 5.13794 14.6726C5.77964 14.9996 6.61969 14.9996 8.29977 14.9997L11.499 14.9999C11.4998 14.9999 11.5002 14.9999 11.5005 14.9999C13.1569 14.9996 14.4996 13.6569 14.5 12.0005C14.5 12.0002 14.5 11.9998 14.5 11.999V11.999M3.5 9.99969L1.5 11.499M3.5 9.99969L5.5 11.499" stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              </button>
            </div>

            <div className="text-[50px] font-sf lg:text-[70px] font-extrabold">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</div>
            <div className="flex relative group">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 " onClick={toggleDropdown}><svg className="opacity-70 hover:opacity-100 delay-300" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 9.5625C9.46599 9.5625 9.84375 9.18474 9.84375 8.71875C9.84375 8.25276 9.46599 7.875 9 7.875C8.53401 7.875 8.15625 8.25276 8.15625 8.71875C8.15625 9.18474 8.53401 9.5625 9 9.5625Z" stroke="#AAAAAA" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.9062 9.5625C15.3722 9.5625 15.75 9.18474 15.75 8.71875C15.75 8.25276 15.3722 7.875 14.9062 7.875C14.4403 7.875 14.0625 8.25276 14.0625 8.71875C14.0625 9.18474 14.4403 9.5625 14.9062 9.5625Z" stroke="#AAAAAA" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.09375 9.5625C3.55974 9.5625 3.9375 9.18474 3.9375 8.71875C3.9375 8.25276 3.55974 7.875 3.09375 7.875C2.62776 7.875 2.25 8.25276 2.25 8.71875C2.25 9.18474 2.62776 9.5625 3.09375 9.5625Z" stroke="#AAAAAA" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              </button>
              {isShow && (
                <div ref={dropdownRef} className="bg-[#000000A3]  p-6 rounded-lg w-[252px] absolute top-[64px] right-[-271px]">
                  <div className="mb-4 flex justify-between items-center " >
                    <label htmlFor="focus-time" className="block text-sm font-medium mb-1 text-[#C9C9C9]">
                      Focus time
                    </label>
                    <input
                      id="focus-time"
                      type="number"
                      value={focusTime}
                      onChange={(e) => handleFocusChange(e)}
                      min={.1}
                      max={60}
                      className=" bg-[#1A1A1A] text-white rounded-lg px-3 py-2 text-[14px] w-[60px]"
                    />
                  </div>
                  <div className="mb-4 flex justify-between items-center ">
                    <label htmlFor="short-break" className="block text-sm font-medium mb-1 text-[#C9C9C9]">
                      Short break
                    </label>
                    <input
                      id="short-break"
                      type="number"
                      value={shortBreak}
                      onChange={(e) => handleShortBreakChange(e)}
                      min={.1}
                      max={15}
                      className=" bg-[#1A1A1A] text-white rounded-lg px-3 py-2 text-[14px] w-[60px]"
                    />
                  </div>

                  <div className="mb-4 flex justify-between items-center ">
                    <label htmlFor="long-break" className="block text-sm font-medium mb-1 text-[#C9C9C9]">
                      Long break
                    </label>
                    <input
                      id="long-break"
                      type="number"
                      value={longBreak}
                      onChange={(e) => handleLongBreakChange(e)}
                      min={.1}
                      max={30}
                      className=" bg-[#1A1A1A] text-white rounded-lg px-3 py-2 text-[14px] w-[60px]"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <label htmlFor="autostart-break" className="text-sm font-medium text-[#C9C9C9]">
                      Autostart break
                    </label>
                    <button onClick={handleButtonClick}>{isButtonClick ? (<svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect y="2" width="30" height="16" rx="8" fill="#68D391" />
                      <g filter="url(#filter0_d_120_946)">
                        <circle cx="22" cy="10" r="6" fill="white" />
                      </g>
                      <defs>
                        <filter id="filter0_d_120_946" x="11" y="0" width="20" height="20" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dx="-1" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_120_946" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_120_946" result="shape" />
                        </filter>
                      </defs>
                    </svg>
                    ) : (<svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#filter0_i_69_1253)">
                        <rect x="1" y="2" width="30" height="16" rx="8" fill="#4A4A4A" />
                      </g>
                      <g filter="url(#filter1_d_69_1253)">
                        <ellipse cx="9.57115" cy="10" rx="6.42857" ry="6" fill="#C8C8C8" />
                      </g>
                      <defs>
                        <filter id="filter0_i_69_1253" x="1" y="2" width="30.2" height="16.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dx="0.2" dy="0.2" />
                          <feGaussianBlur stdDeviation="0.5" />
                          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_69_1253" />
                        </filter>
                        <filter id="filter1_d_69_1253" x="0.142578" y="0" width="20.8574" height="20" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dx="1" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_69_1253" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_69_1253" result="shape" />
                        </filter>
                      </defs>
                    </svg>)}
                    </button>
                  </div>
                  <div className="flex items-center  justify-between mb-4">
                    <label htmlFor="autostart-next-session" className="text-sm font-medium text-[#C9C9C9]">
                      Autostart next session
                    </label>
                    <button onClick={handleButtonClickNextSession}>{isButtonClickNextSession ? (<svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect y="2" width="30" height="16" rx="8" fill="#68D391" />
                      <g filter="url(#filter0_d_120_946)">
                        <circle cx="22" cy="10" r="6" fill="white" />
                      </g>
                      <defs>
                        <filter id="filter0_d_120_946" x="11" y="0" width="20" height="20" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dx="-1" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_120_946" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_120_946" result="shape" />
                        </filter>
                      </defs>
                    </svg>
                    ) : (<svg width="31" height="20" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#filter0_i_69_1253)">
                        <rect x="1" y="2" width="30" height="16" rx="8" fill="#4A4A4A" />
                      </g>
                      <g filter="url(#filter1_d_69_1253)">
                        <ellipse cx="9.57115" cy="10" rx="6.42857" ry="6" fill="#C8C8C8" />
                      </g>
                      <defs>
                        <filter id="filter0_i_69_1253" x="1" y="2" width="30.2" height="16.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dx="0.2" dy="0.2" />
                          <feGaussianBlur stdDeviation="0.5" />
                          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_69_1253" />
                        </filter>
                        <filter id="filter1_d_69_1253" x="0.142578" y="0" width="20.8574" height="20" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                          <feOffset dx="1" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_69_1253" />
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_69_1253" result="shape" />
                        </filter>
                      </defs>
                    </svg>)}
                    </button>
                  </div>
                  <div className="mb-4 flex  justify-between items-center">
                    <label htmlFor="long-break-interval" className="block text-sm font-medium mb-1 text-[#C9C9C9]">
                      Long break interval
                    </label>
                    <input
                      id="long-break-interval"
                      type="number"
                      value={longBreakInterval}
                      onChange={(e) => handleLongBreakIntervalChange(e)}
                      min={1}
                      max={60}
                      className=" bg-[#1A1A1A] text-white rounded-lg px-3 py-2 text-[14px] w-[60px]"
                    />
                  </div>
                </div>)
              }
            </div>
          </div>
          <div className="flex justify-center mt-[46px] mb-[60px]">
            <div className="w-[184px] h-[44px]  border-[1px] border-[#FFFFFF29] rounded-[22px] relative">
              <button onClick={handleDecreaseTime} className="text-[#FFFFFF] absolute top-[10px] left-[19px] opacity-70 hover:opacity-100"> -5</button>
              {isRunning ? (
                <button onClick={handlePauseClick} className="absolute top-[-6px] left-[57px] opacity-80 hover:opacity-100">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_69_1271)">
                      <path d="M30 0C13.4575 0 0 13.4575 0 30C0 46.5425 13.4575 60 30 60C46.5425 60 60 46.5425 60 30C60 13.4575 46.5425 0 30 0ZM27.5 40C27.5 41.38 26.38 42.5 25 42.5C23.62 42.5 22.5 41.38 22.5 40C22.5 40 22.5 21.38 22.5 20C22.5 18.62 23.62 17.5 25 17.5C26.38 17.5 27.5 18.62 27.5 20V40ZM37.5 40C37.5 41.38 36.38 42.5 35 42.5C33.62 42.5 32.5 41.38 32.5 40V20C32.5 18.62 33.62 17.5 35 17.5C36.38 17.5 37.5 18.62 37.5 20V40Z" fill="white" fillOpacity="0.8" />
                    </g>
                    <defs>
                      <clipPath id="clip0_69_1271">
                        <rect width="60" height="60" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>) : (<button onClick={handleStartClick} className="absolute top-[-6px] left-[57px] opacity-80 hover:opacity-100"><svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_26_210)">
                    <path d="M0 30C0 35.9334 1.75947 41.7336 5.05591 46.6671C8.35235 51.6006 13.0377 55.4458 18.5195 57.7164C24.0013 59.987 30.0333 60.5811 35.8527 59.4236C41.6721 58.266 47.0176 55.4088 51.2132 51.2132C55.4088 47.0176 58.266 41.6721 59.4236 35.8527C60.5811 30.0333 59.987 24.0013 57.7164 18.5195C55.4458 13.0377 51.6006 8.35235 46.6671 5.05591C41.7336 1.75947 35.9334 0 30 0C22.0461 0.0086027 14.4205 3.17207 8.7963 8.7963C3.17207 14.4205 0.0086027 22.0461 0 30ZM27.75 18.1725L40.635 28.39C40.8497 28.5996 41.0203 28.85 41.1368 29.1265C41.2532 29.403 41.3132 29.7 41.3132 30C41.3132 30.3 41.2532 30.597 41.1368 30.8735C41.0203 31.15 40.8497 31.4004 40.635 31.61L27.75 41.8275C27.4281 42.1472 27.0191 42.365 26.5742 42.4537C26.1292 42.5425 25.668 42.4983 25.248 42.3265C24.8281 42.1548 24.468 41.8632 24.2127 41.4882C23.9574 41.1131 23.8182 40.6712 23.8125 40.2175V19.7825C23.8182 19.3288 23.9574 18.8869 24.2127 18.5118C24.468 18.1368 24.8281 17.8452 25.248 17.6735C25.668 17.5018 26.1292 17.4575 26.5742 17.5463C27.0191 17.635 27.4281 17.8528 27.75 18.1725Z" fill="#C9C9C9" />
                  </g>
                  <defs>
                    <clipPath id="clip0_26_210">
                      <rect width="60" height="60" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                </button>)
              }
              <button onClick={handleIncreaseTime} className="text-[#FFFFFF] absolute top-[8px] right-[26px] opacity-70 hover:opacity-100"> +5</button>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
    </>
  );
}