import instance from "@/api/axios";
import { addFooterCompany, deleteFooterCompany, setFooterCompany } from "@/redux/fetures/footer/footerCompanySlice";
import { RootState } from "@/redux/store/store";
import { Button, Form, Input, Space, Switch } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface Company {
  _id: string;
  category: string;
  description: string;
}

const CompanyTab = () => {
  const [content, setContent] = useState("");
  const companies: Company[] = useSelector((state: RootState) => state.footerCompany.footerCompany);
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [inputValue, setInputValue] = useState<string>("");


  const [visibilityState, setVisibilityState] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; description: string } | null>(null);

  const Editor = useRef(null);
  const handleAddItem = async () => {
    if (!inputValue.trim()) return;
    if (!content.trim()) return;
    const res = await instance.post('/admin/home/company-category', {
      category: inputValue.trim(),
      description: content,
    });
    if (res.data && res.data.success) {
      dispatch(addFooterCompany(res.data.data));
      setVisibilityState((prev) => ({
        ...prev,
        [res.data.data._id]: true,
      }));
      setInputValue("");
      setContent("");
    }
  };

  // Delete item handler
  const handleDeleteItem = async (id: string) => {
    const res = await instance.delete(`/admin/home/company-category/${id}`);
    if (res.data && res.data.success) {
      dispatch(deleteFooterCompany(id));
      setVisibilityState((prev) => {
        const newState = { ...prev };
        delete newState[id]; // Remove visibility state for the deleted item
        return newState;
      });
      // Reset selected category if deleted
      if (selectedCategory && selectedCategory.id === id) {
        setSelectedCategory(null);
        setContent(""); // Clear the editor content
      }
    }
  };

  // Toggle visibility handler
  const handleToggleVisibility = (id: string) => {
    setVisibilityState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    const selected = companies.find(item => item._id === id);
    if (selected) {
      setSelectedCategory({ id: selected._id, description: selected.description });
      setContent(selected.description);
    }
  };

  const fetchCompanies = async () => {
    const res = await instance.get('/admin/home/company-category');
    console.log(res);
    if (res.data && res.data.success) {
      dispatch(setFooterCompany(res.data.data));
      const initialVisibilityState: { [key: string]: boolean } = {};
      res.data.data.forEach((item: Company) => {
        initialVisibilityState[item._id] = true; // Initialize visibility state
      });
      setVisibilityState(initialVisibilityState);
    }
  };

  useEffect(() => {
      const fetchCompanies = async () => {
    const res = await instance.get('/admin/home/company-category');
    console.log(res);
    if (res.data && res.data.success) {
      dispatch(setFooterCompany(res.data.data));
      const initialVisibilityState: { [key: string]: boolean } = {};
      res.data.data.forEach((item: Company) => {
        initialVisibilityState[item._id] = true; // Initialize visibility state
      });
      setVisibilityState(initialVisibilityState);
    }
  };
    fetchCompanies();
  }, [dispatch]);

  const handleSelectedCompany = (company: Company) => {
    setSelectedCompany(company);
    setContent(company.description);
  };

  return (
    <section>
      <div className="container mx-auto">
        <div className="flex justify-end">
          {/* <h2 className="my-4 text-left text-2xl font-bold text-black">Company Categories</h2> */}
          <button className="bg-[#ffb200] mb-3 mt-2 w-18 h-9 text-black rounded">
            Save
          </button>
        </div>

        <div className="flex gap-2">
          <div className="min-w-[200px] bg-white p-3 rounded-md h-[37.5rem]">
            <Form className="flex flex-col gap-4">
              <Space.Compact>
                <Form.Item name={["search-field"]} noStyle>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{
                      padding: "10px",
                      width: "100%",
                      color: "black",
                      background: "white",
                      outlineWidth: "0",
                    }}
                    placeholder="Category"
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
                      color: "black",
                    }}
                    onClick={handleAddItem}
                  >
                    Add
                  </Button>
                </Form.Item>
              </Space.Compact>

              {companies?.map((item, index) => (
                <Space.Compact
                  onClick={() => handleSelectedCompany(item)}
                  key={item._id}
                  className={`border border-[#ffb200] rounded-lg ${selectedCategory && selectedCategory._id === item._id ? "bg-[#ffb200]" : ""}`}
                >
                  <Form.Item noStyle>
                    <Input
                      value={visibilityState[item._id] ? item.category : "*****"}
                      readOnly
                      style={{
                        background: "transparent",
                        padding: "10px",
                        width: "100%",
                        border: "none",
                        outline: "none",
                      }}
                    />
                  </Form.Item>
                  <Form.Item noStyle>
                    <div className="flex items-center gap-2">
                      <Switch
                        style={{
                          background: "#ffb200",
                        }}
                        checked={visibilityState[item._id]}
                        onChange={() => handleToggleVisibility(item._id)}
                      />
                      <BiTrash
                        className="text-red text-2xl cursor-pointer"
                        onClick={() => handleDeleteItem(item._id)}
                      />
                    </div>
                  </Form.Item>
                </Space.Compact>
              ))}
            </Form>
          </div>
          
          <div className="md:h-screen flex-1 rounded-md">
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

export default CompanyTab;
