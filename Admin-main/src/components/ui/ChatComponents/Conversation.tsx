import { useAppSelector } from "@/redux/hooks/hooks";
import ChatsCard from "./ChatsCard";
import { FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";

const Conversation = () => {
  const [userModal, setUserModal] = useState(false);
  const [statusUser, setStatusUser] = useState("");
  const [showDropManuCall, setShowDropManuCall] = useState(false);
  const allUsers: any = useAppSelector((state) => state.users.allUsers);
  const [usersData, setUsersData] = useState(allUsers);
  const requestedUser = useAppSelector((state) => state.users.requesteUsers);
  const forwardRequest = useAppSelector(
    (state) => state.users.forwordRequestUsers,
  );

  useEffect(() => {
    if (statusUser === "request") {
      setUsersData(requestedUser);
    } else if (statusUser === "forward-request") {
      setUsersData(forwardRequest);
    } else if (statusUser === "all") {
      setUsersData(allUsers);
    }
  }, [allUsers, forwardRequest, requestedUser, statusUser]);

  const handleShowDropManuCall = () => {
    setShowDropManuCall(!showDropManuCall);
  };
  return (
    <div className="col-span-full h-full w-full   md:col-span-4 ">
      <div className="p-3">
        <span className="flex">
          <form className="mt-2 w-full">
            <label
              htmlFor="default-search"
              className="sr-only mb-2 text-sm font-medium text-slate-900 "
            >
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="h-4 w-4 text-slate-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <div className="flex items-end justify-between">
                <input
                  type="search"
                  id="default-search"
                  className="placeholdeer-slate-300 block h-8 w-full rounded-lg border border-slate-300 bg-white p-4 ps-10 text-sm outline-none "
                  placeholder="Search messages or users"
                  value={""}
                />
              </div>
            </div>
          </form>
          <div className="relative mt-2">
            <button className="mx-1 cursor-pointer rounded-lg border border-solid  border-slate-300 bg-slate-200 px-4 py-2 text-blue-500 shadow-lg  ">
              <FiSettings onClick={handleShowDropManuCall} />
            </button>
            {showDropManuCall && (
              <div className="absolute left-0 top-10 z-99  flex  items-start ">
                <div className="texts w-[300px] space-y-1 rounded-lg bg-slate-400  p-4 text-white shadow-1 ">
                  <div key="" className="flex  justify-between ">
                    <span className="mr-5 font-medium  ">
                      OutComming Call
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        value={""}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300    rtl:peer-checked:after:-translate-x-full"></div>
                    </label>
                  </div>
                  <div key="" className="flex  justify-between ">
                    <span className=" mr-5 font-medium  ">
                      Incoming Call
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        value={""}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300    rtl:peer-checked:after:-translate-x-full"></div>
                    </label>
                  </div>
                  <div key="" className="flex  justify-between ">
                    <span className=" mr-5 font-medium  ">
                      Notification
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        value={""}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300    rtl:peer-checked:after:-translate-x-full"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </span>
        <div className=" relative ">
          <div
            className=" relative my-2 w-full cursor-pointer rounded-xl bg-slate-200 bg-opacity-60 p-2 font-semibold  "
            onClick={() => setUserModal(!userModal)}
          >
            All people
          </div>
          {userModal && (
            <div className=" absolute -right-56 top-0 z-50  flex w-56 cursor-pointer flex-col gap-2 rounded-xl bg-slate-200 p-3 ">
              <div
                onClick={() => [setStatusUser("request"), setUserModal(false)]}
                className=" w-full rounded-xl bg-slate-300 bg-opacity-90 p-2 "
              >
                Request help {requestedUser?.length}
              </div>
              <div
                onClick={() => [
                  setStatusUser("forward-request"),
                  setUserModal(false),
                ]}
                className=" w-full rounded-xl bg-slate-300 bg-opacity-90 p-2 "
              >
                Forward Request {forwardRequest?.length}
              </div>
            </div>
          )}
          <div
            onClick={() => [setStatusUser("all"), setUserModal(false)]}
            className=" w-full cursor-pointer rounded-xl bg-slate-200 bg-opacity-60 p-2 font-semibold  "
          >
            All users
          </div>
        </div>
      </div>
      <div className=" h-[calc(100vh-250px)] w-full overflow-y-scroll ">
        {usersData.map((item: any, index: number) => {
          return <ChatsCard key={index} item={item} />;
        })}
      </div>
    </div>
  );
};

export default Conversation;
