import HeroSection from "./component/HeroSection";
import TaskSection from "./component/TaskSection";

function App() {
  return (
    <>
      <div className="mx-[20%] ">
        <div >
          <HeroSection></HeroSection>
        </div>
        <div className="mb-[10%]">
          <TaskSection></TaskSection>
        </div>
      </div>
    </>
  );
}

export default App;
