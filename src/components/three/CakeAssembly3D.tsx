import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Layer({ position, color, height = 0.3, visible = true, delay = 0 }: { position: [number, number, number]; color: string; height?: number; visible?: boolean; delay?: number }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    if (ref.current && visible) {
      t.current = Math.min(t.current + dt, 1.5);
      const progress = Math.max(0, Math.min(1, (t.current - delay) / 1));
      ref.current.position.y = position[1] - (1 - progress) * 3;
      ref.current.scale.setScalar(progress);
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.9, 0.9, height, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function CakeAssembly3D({ step = 6, height = 420 }: { step?: number; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <Canvas shadows camera={{ position: [3, 2, 4], fov: 40 }} dpr={[1, 2]}>
        <color attach="background" args={["#fff7fb"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 5, 4]} intensity={1.1} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#b9dcff" />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <Layer position={[0, 0.4, 0]} color="#fff0e0" visible={step >= 1} delay={0} height={0.4} />
            <Layer position={[0, 0.9, 0]} color="#fff5e6" visible={step >= 2} delay={0.4} height={0.3} />
            <Layer position={[0, 1.3, 0]} color="#7a3e1d" visible={step >= 3} delay={0.8} height={0.3} />
            {step >= 4 && (
              <>
                <mesh position={[0.5, 1.5, 0]} castShadow>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshStandardMaterial color="#ff3358" />
                </mesh>
                <mesh position={[-0.4, 1.5, 0.3]} castShadow>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshStandardMaterial color="#ff3358" />
                </mesh>
                <mesh position={[0.2, 1.5, -0.4]} castShadow>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshStandardMaterial color="#118ab2" />
                </mesh>
              </>
            )}
            {step >= 5 && (
              <mesh position={[0, 1.75, 0]} castShadow>
                <torusGeometry args={[0.4, 0.04, 8, 32]} />
                <meshStandardMaterial color="#ffd166" />
              </mesh>
            )}
            {step >= 6 && (
              <>
                <mesh position={[0, 1.95, 0]} castShadow>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshStandardMaterial color="#ff3358" emissive="#ff5c97" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0, 2.1, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
                  <meshStandardMaterial color="#3a6b2a" />
                </mesh>
              </>
            )}
          </Float>
          <ContactShadows position={[0, -0.5, 0]} opacity={0.3} scale={5} blur={2} far={3} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
