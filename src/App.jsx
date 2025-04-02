import HeroSection from "./component/HeroSection";
import TaskSection from "./component/TaskSection";

function App() {
  return (
    <>
      <div className="flex justify-center">
        <div className="">
        <div >
          <HeroSection></HeroSection>
        </div>
        <div className="mb-[5%]">
          <TaskSection></TaskSection>
        </div>
        </div>
      
      </div>
    </>
  );
}

export default App;
