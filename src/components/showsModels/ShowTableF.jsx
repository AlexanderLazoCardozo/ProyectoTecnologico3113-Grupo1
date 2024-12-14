import { Center, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import CanvasLoader from "../CanvasLoader";
import PinkFridge from "../PinkFridge";
import TableFridge from "../TableFridge";

const ShowTableF = () => {
  return (
    <Canvas
      shadows
      style={{
        background: "linear-gradient(135deg, #4f4f4f, #1c1c1c)",
      }}
      camera={{ position: [0, 0, 6.5], fov: 50 }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <directionalLight position={[0, 2, 4]} intensity={2.4} castShadow />

        <directionalLight position={[-4, 1, -1]} intensity={0.8} />
        <directionalLight position={[3, 0, -1]} intensity={4} />

        <ambientLight intensity={0.4} />

        <pointLight
          position={[0, 0, 0.5]}
          intensity={1.2}
          decay={2}
          distance={4}
        />

        <pointLight
          position={[0, -2, 0.5]}
          intensity={0.6}
          decay={2}
          distance={3}
        />
        <Center>
          <group scale={2} position={[0, -3, 0]} rotation={[0.4, -0.7, 0]}>
            <TableFridge />
          </group>
        </Center>

        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          enableZoom={true}
          minDistance={1}
          maxDistance={6.5}
        />
      </Suspense>
    </Canvas>
  );
};

export default ShowTableF;
