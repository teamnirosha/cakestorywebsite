import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls, ContactShadows } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function CakeTier({ position, scale, color, height = 0.4 }: { position: [number, number, number]; scale: number; color: string; height?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, height, 32]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* drip layer */}
      <mesh position={[0, height / 2 - 0.02, 0]}>
        <torusGeometry args={[1.0, 0.05, 8, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Cake() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });
  return (
    <group ref={ref} position={[0, -0.4, 0]}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* base */}
        <CakeTier position={[0, 0, 0]} scale={1.1} color="#fff0e0" height={0.5} />
        <CakeTier position={[0, 0.55, 0]} scale={0.9} color="#ffc7d9" height={0.45} />
        <CakeTier position={[0, 1.05, 0]} scale={0.7} color="#ff7eb3" height={0.4} />
        <CakeTier position={[0, 1.5, 0]} scale={0.5} color="#ffd3e2" height={0.35} />
        {/* cherry top */}
        <mesh position={[0, 1.85, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ff3358" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.97, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
          <meshStandardMaterial color="#3a6b2a" />
        </mesh>
        {/* sprinkles */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const r = 0.95;
          const colors = ["#ffd166", "#06d6a0", "#118ab2", "#ef476f", "#ff7eb3"];
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 1.85, Math.sin(angle) * r]} rotation={[Math.random(), Math.random(), Math.random()]}>
              <boxGeometry args={[0.06, 0.03, 0.03]} />
              <meshStandardMaterial color={colors[i % colors.length]} />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

function FloatingIngredient({ position, color, geometry = "sphere", size = 0.15 }: { position: [number, number, number]; color: string; geometry?: "sphere" | "box" | "torus"; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
      ref.current.rotation.x = t * 0.4;
      ref.current.rotation.z = t * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      {geometry === "sphere" && <sphereGeometry args={[size, 16, 16]} />}
      {geometry === "box" && <boxGeometry args={[size, size, size]} />}
      {geometry === "torus" && <torusGeometry args={[size, size / 3, 8, 16]} />}
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const positions = new Float32Array(Array.from({ length: 200 }, () => Math.random() * 2 - 1).flatMap(() => [Math.random() * 8 - 4, Math.random() * 6 - 3, Math.random() * 6 - 3]));
  useFrame((state) => {
    if (points.current) points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ff7eb3" transparent opacity={0.6} />
    </points>
  );
}

export default function Cake3D({ autoRotate = true, height = 380 }: { autoRotate?: boolean; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <Canvas shadows camera={{ position: [3.5, 2.4, 4], fov: 38 }} dpr={[1, 2]}>
        <color attach="background" args={["#fdf3f9"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#b9dcff" />
        <Suspense fallback={null}>
          <Cake />
          <FloatingIngredient position={[-1.8, 0.8, 0.5]} color="#ff3358" geometry="sphere" size={0.18} />
          <FloatingIngredient position={[1.7, 1.2, -0.4]} color="#ffd166" geometry="torus" size={0.16} />
          <FloatingIngredient position={[1.5, -0.2, 0.7]} color="#06d6a0" geometry="sphere" size={0.13} />
          <FloatingIngredient position={[-1.5, 1.5, -0.7]} color="#118ab2" geometry="box" size={0.18} />
          <FloatingIngredient position={[0.5, 1.8, -1.4]} color="#ff7eb3" geometry="sphere" size={0.12} />
          <FloatingIngredient position={[-0.7, -0.5, 1.4]} color="#e7d6ff" geometry="torus" size={0.15} />
          <ParticleField />
          <ContactShadows position={[0, -1.0, 0]} opacity={0.3} scale={6} blur={2} far={3} />
          <Environment preset="sunset" />
        </Suspense>
        {autoRotate && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />}
      </Canvas>
    </div>
  );
}
