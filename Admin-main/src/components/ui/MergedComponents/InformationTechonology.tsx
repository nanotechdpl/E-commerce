// import React, { useRef, useState } from "react";
// import { BiTrash } from "react-icons/bi";
// import dynamic from "next/dynamic";
// import { Button, Form, Input, Space, Switch } from "antd";
// import BleuButton from "../button/BleuButton";

// const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// interface Item {
//   id: number;
//   text: string;
//   visible: boolean;
// }

// const InformationTechnology: React.FC = () => {
//   const editorRef = useRef(null);

//   const [content, setContent] = useState<string>("");
//   const [inputValue, setInputValue] = useState<string>("");
//   const [dataList, setDataList] = useState<Item[]>([]);
//   const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
//   const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

//   // Add new item to list
//   const handleAddData = () => {
//     if (inputValue.trim() !== "") {
//       setDataList([
//         ...dataList,
//         {
//           id: Date.now(),
//           text: inputValue.trim(),
//           visible: true,
//         },
//       ]);
//       setInputValue(""); // Clear input field
//     }
//   };

//   // Toggle visibility of item
//   const handleToggleVisibility = (id: number) => {
//     setDataList(
//       dataList.map((item) =>
//         item.id === id ? { ...item, visible: !item.visible } : item
//       )
//     );
//   };

//   // Delete an item
//   const handleDelete = (id: number) => {
//     setDeleteIndex(id);
//     setShowConfirmation(true);
//   };

//   const confirmDelete = () => {
//     if (deleteIndex !== null) {
//       setDataList(dataList.filter((item) => item.id !== deleteIndex));
//       setDeleteIndex(null);
//       setShowConfirmation(false);
//     }
//   };

//   const cancelDelete = () => {
//     setDeleteIndex(null);
//     setShowConfirmation(false);
//   };

//   return (
//     <div className="flex gap-2">
//       {/* Sidebar */}
//       <div className="min-w-[200px] bg-[#D1CCCC] p-3">
//         <Form className="flex flex-col gap-4">
//           {/* Input Field and Add Button */}
//           <Space.Compact>
//             <Form.Item noStyle>
//               <Input
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="Enter item"
//                 style={{ padding: "10px", width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item noStyle>
//               <Button
//                 onClick={handleAddData}
//                 style={{
//                   background: "#D9D9D9",
//                   border: "0",
//                   padding: "25px",
//                   display: "flex",
//                   alignItems: "center", 
//                 }}
//               >
//                 Add
//               </Button>
//             </Form.Item>
//           </Space.Compact>

//           {/* Display List of Items */}
//           {dataList.map((item) => (
//             <Space.Compact key={item.id} className="mb-2">
//               <Form.Item noStyle>
//                 <Input
//                   value={item.visible ? item.text : "*****"}
//                   readOnly
//                   style={{
//                     padding: "10px",
//                     width: "100%",
//                     background: "#D9D9D9",
//                   }}
//                 />
//               </Form.Item>
//               <Form.Item noStyle>
//                 <div className="flex items-center gap-2">
//                   <Switch
//                     checked={item.visible}
//                     onChange={() => handleToggleVisibility(item.id)}
//                   />
//                   <BiTrash
//                     className="text-red text-2xl cursor-pointer"
//                     onClick={() => handleDelete(item.id)}
//                   />
//                 </div>
//               </Form.Item>
//             </Space.Compact>
//           ))}
//         </Form>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 md:h-screen">
//         <h2 className="my-4 text-center text-xl md:text-2xl lg:text-3xl font-bold">
//           Information Technology
//         </h2>
//         <form action="" className="relative">
//           <div className="absolute -top-10 right-5 flex items-center gap-3">
//             <BleuButton title="Save" />
//           </div>
//           <label className="text-md py-5">Description</label>
//           <JoditEditor
//             ref={editorRef}
//             value={content}
//             config={{
//               height: 600,
//             }}
//             onBlur={(newContent) => setContent(newContent)}
//           />
//         </form>
//       </div>

//       {/* Confirmation Modal */}
//       {showConfirmation && (
//         <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-slate-700 bg-opacity-75">
//           <div className="rounded-md bg-white p-4">
//             <p>Are you sure you want to delete this item?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 className="rounded-md bg-blue-500 px-4 py-2 text-white"
//                 onClick={confirmDelete}
//               >
//                 Yes
//               </button>
//               <button
//                 className="rounded-md bg-gray-300 px-4 py-2 text-black"
//                 onClick={cancelDelete}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InformationTechnology;









import { Button, Form, Input, Space, Switch } from "antd";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";
import BleuButton from "../button/BleuButton";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface Item {
  id: number;
  text: string;
  visible: boolean;
}

const InformationTechnology = () => {
  const [content, setContent] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const Editor = useRef(null);

  // Add item handler
  const handleAddItem = () => {
    if (!inputValue.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        text: inputValue.trim(),
        visible: true,
      },
    ]);
    setInputValue(""); // Clear the input
  };

  // Delete item handler
  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Toggle visibility handler
  const handleToggleVisibility = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  return (
    <section>
      <div className="container mx-auto">
        <div className="flex justify-between">
        <h2 className="my-4 text-left text-2xl font-bold text-black">
          Information Technology
      </h2>
      <button className="bg-[#ffb200] mt-2 w-14 h-9 text-black rounded">
        Save
      </button>
        </div>
      

      {/* <div className="absolute -top-20 right-5 flex items-center gap-3">
          <BleuButton title="Save" />
        </div> */}
        <div className="flex gap-2">
          {/* Left Sidebar */}
          
          <div className="min-w-[200px] bg-white p-3">
          
            <Form className="flex flex-col gap-4">
              {/* Add Item Form */}
              <Space.Compact>
                <Form.Item name={["search-field"]} noStyle>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ padding: "10px", width: "100%", 
                      color: "black", background: "white",
                      outlineWidth: "0"  }}
                    placeholder="Enter item"
                  />
                </Form.Item>
                <Form.Item noStyle>
                  <Button
                    style={{
                      background: "#ffb200",
                      border: "0",
                      display: "flex",
                      alignItems: "center",
                      padding: "25px",
                      color: "black"                      
                    }}
                    onClick={handleAddItem}
                  >
                    Add
                  </Button>
                </Form.Item>
              </Space.Compact>

              {/* List Items */}
              {items.map((item) => (
                <Space.Compact key={item.id}>
                  <Form.Item noStyle>
                    <Input
                      value={item.visible ? item.text : "*****"}
                      readOnly
                      style={{
                        padding: "10px",
                        width: "100%",
                        background: "#D9D9D9",
                      }}
                    />
                  </Form.Item>
                  <Form.Item noStyle>
                    <div className="flex items-center bg-[#D9D9D9] gap-2">
                      <Switch
                        style={{
                          background: "#ffb200",
                        }}
                        checked={item.visible}
                        onChange={() => handleToggleVisibility(item.id)}
                      />
                      <BiTrash
                        className="text-red text-2xl cursor-pointer"
                        onClick={() => handleDeleteItem(item.id)}
                      />
                    </div>
                  </Form.Item>
                </Space.Compact>
              ))}
            </Form>
          </div>

          {/* Main Content Area */}
          <div className="md:h-screen flex-1">
            
            <form action="" className="relative">
              
              <span className="">
                <JoditEditor
                  ref={Editor}
                  value={content}
                  config={{
                    height: 600,
                  }}
                  onBlur={(newContent) => setContent(newContent)}
                />
              </span>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InformationTechnology;
