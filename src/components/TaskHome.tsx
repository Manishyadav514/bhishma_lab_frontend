import React, { Children } from "react";
import { CommonButton } from "./common/CommonButton";
import { IconSurvey } from "./common/Icons";

interface TaskHomeInterface {
  taskName: any;
  taskMessage: any;
  handleStartGame: any;
}

const TaskHome = ({
  taskName,
  taskMessage,
  handleStartGame,
}: TaskHomeInterface) => {
  return (
    // <div className="w-full h-full overflow-hidden">
    //   <div className="w-full h-auto text-center text-3xl text-primary pt-12">
    //     {taskName}
    //   </div>
    //   <div className="w-full h-auto p-5 flex justify-between text-gray-500">
    //     <p>
    //       Say to the child
    //       <strong className="">{`, "${taskMessage}"`}</strong>
    //     </p>
    //     <CommonButton
    //       labelText={"Start Survey"}
    //       clicked={() => handleStartGame()}
    //     />
    //   </div>
    // </div>
    <div className="w-full h-auto bg-gradient-to-b from-black to-black">
      <div className="container mx-auto overflow-hidden py-8 md:py-8">
        <div className="flex justify-between gap-12">
          <div className="flex flex-col justify-center ">
            <h2 className="text-4xl font-bold text-gray-300 text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">
              {taskName}
            </h2>
            <div className="h-1 my-2 border-t border-gray-800"></div>
            <p className="font-serif text-sm  md:text-base text-gray-400 md:pr-20">
              Say to the child
              <strong className="">{`, "${taskMessage}"`}</strong>
            </p>
          </div>
          <div className="">
            <CommonButton
              labelText={"Start Survey"}
              clicked={() => handleStartGame()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHome;
