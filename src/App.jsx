import HeroSection from "./component/HeroSection";
import TaskSection from "./component/TaskSection";

function App() {
  return (
    <>
      <div className="mx-[20%] max-w-6xl">
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
