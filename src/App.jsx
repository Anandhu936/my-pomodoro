import HeroSection from "./component/HeroSection";
import TaskSection from "./component/TaskSection";

function App() {
  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-[1200px] ">
        <div >
          <HeroSection></HeroSection>
        </div>
        <div className="mb-[10%]">
          <TaskSection></TaskSection>
        </div>
        </div>
      
      </div>
    </>
  );
}

export default App;
