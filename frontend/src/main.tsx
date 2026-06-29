import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import PixelBlast from "../@/components/PixelBlast.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      position: "relative",
      overflow: "hidden" 
    }}>
      <PixelBlast
        variant="square"
        pixelSize={5}
        color="#39FF14"
        patternScale={2}
        patternDensity={1}
        enableRipples
        rippleSpeed={0.3}
        rippleThickness={0.1}
        rippleIntensityScale={1}
        speed={0.5}
        transparent
        edgeFade={0.25}
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%" 
        }}
      />
      <App />
    </div>
  </StrictMode>,
);