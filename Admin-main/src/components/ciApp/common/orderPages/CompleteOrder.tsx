import React from "react";
import GreenButton from "../../../ui/button/GreenButton";
import RedButton from "../../../ui/button/RedButton";
import OrangeButton from "../../../ui/button/OrangeButton";
import BleuButton from "../../../ui/button/BleuButton";

function CompleteOrder() {
  return (
    <section className="pt-8 ">
      <div className="mb-3 mt-1 flex w-full justify-start ">
        <h1 className="mx-3 w-fit rounded-br-lg rounded-tl-lg bg-gradient-to-t from-pink-500 to-yellow-300 p-2 text-start text-lg font-bold text-blue-800">
          Complete Order{" "}
        </h1>
      </div>

      <div className="flex justify-center gap-2">
        <GreenButton title="Accept" />
        <RedButton title="Decline" />

        <OrangeButton title="Admin Notepad" />
        <OrangeButton title="Status" />

        <GreenButton title="save" />
      </div>

      <div className="flex flex-col items-start gap-2">
        <div className="mt-20 flex flex-col gap-2">
          <BleuButton title="Project is required" />
          <BleuButton title="What currency do you want to pay in ?" />
          <BleuButton title="Upload the project file" />
          <BleuButton title="Provides athor project files" />
        </div>{" "}
      </div>
    </section>
  );
}

export default CompleteOrder;
