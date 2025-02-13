import React, { useState } from "react";
import QRCode from "qrcode.react";

const QRCodeGenerator= () => {
  const [text, setText] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Enter text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "20px",
          width: "250px",
          textAlign: "center",
        }}
      />
      {text && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <QRCode value={text} size={200} />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
