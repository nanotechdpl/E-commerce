import { useState } from "react";
import { Modal, Button, Tree, Select } from "antd";

const FullHeightTreeSelect = ({
  treeData,
  setSelectedPermissions,
}: {
  treeData: any[];
  setSelectedPermissions: (permissions: string[]) => void;
}) => {
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const openTreeModal = () => {
    setIsTreeModalOpen(true);
  };

  const closeTreeModal = () => {
    setIsTreeModalOpen(false);
  };

  // const handleSelect = (keys: string[]) => {

  //   const newTreeData = treeData.map(parentNode => {
  //     console.log("parentNode", parentNode);
  //     if (parentNode.key === 'main-admin') { // Example: Disable all children of Parent 1 if it is checked
  //       // I want to disable all children of Parent 1 if it is checked
  //       const children = parentNode.children.map((child: any) => ({
  //         ...child,
  //         disabled: !keys.includes(child.key),
  //       }));
  //       console.log("newTreeData", children);
  //       return { ...parentNode, children };
  //     }
  //     return parentNode;
  //   });
  

  //   setSelectedKeys(keys);
  //   setSelectedPermissions(keys);
  // };
 const handleSelect = (checkedKeys: string[], info: any) => {
  setSelectedKeys(checkedKeys);
  setSelectedPermissions(checkedKeys);

  // Your logic for disabling nodes (if needed)
  const isOtherNodeChecked = checkedKeys.some(key => key !== 'main-admin');
  const newTreeData = treeData.map(node => {
    if (node.key === 'main-admin') {
      return {
        ...node,
        disabled: isOtherNodeChecked
      };
    }
    return node;
  });
  // If you want to update treeData, do it here
  // setTreeData(newTreeData);
  console.log("newTreeData", newTreeData);
};
  console.log("selectedKeys", selectedKeys);
  return (
    <div>
      {/* Trigger Button */}
      <Select
        onClick={openTreeModal}
        style={{
          background: "#fff",
          color: "black",
          fontWeight: 400,
          width: 300,
          padding: 20,
        }}
      />

      {/* Full-Height Side Modal */}
      <Modal
        open={isTreeModalOpen}
        onCancel={closeTreeModal}
        footer={null}
        closable={false}
        width="400px" // Side modal width
        // bodyStyle={{ backgroundColor: "#ccccff" }}
        style={{
          top: 0,
          right: 0,
          left: 800,
          margin: 0,
          height: "100vh",
          overflowY: "auto",
          padding: "16px",
        }}
        className="custom-side-modal"
        centered={false} // Align to the top
      >
        <div className="h-full flex flex-col ">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b ">
            <h3 className="text-lg font-semibold">Select Access</h3>
            <Button onClick={closeTreeModal} type="text" danger>
              Close
            </Button>
          </div>

          {/* Tree Component */}
          <div className="flex-grow mt-4">
            <Tree
              treeData={treeData}
              checkable
              defaultExpandAll
              onCheck={(checkedKeys) => handleSelect(checkedKeys as string[])}
              selectedKeys={selectedKeys}
              style={{ backgroundColor: "#ccccff" }}
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t flex justify-end space-x-2">
            <Button onClick={closeTreeModal}>Cancel</Button>
            <Button type="primary" onClick={closeTreeModal}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FullHeightTreeSelect;
