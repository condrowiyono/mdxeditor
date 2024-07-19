import { Spin } from "antd";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;
