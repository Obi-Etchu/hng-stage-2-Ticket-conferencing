import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const BarcodeGenerator = ({
  value,
  format = "CODE128", 
  width = 2, 
  height = 100, 
  lineColor = "#000", 
  displayValue = true 
}) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, value, {
          format,
          lineColor,
          width,
          height,
          displayValue,
          background: "transparent"
        });
      }
    }, [value, format, width, height, lineColor, displayValue]);

  return <svg ref={barcodeRef}></svg>;
};

export default BarcodeGenerator;
