import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function ConveyorBelt() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      if (m.map) m.map.offset.x -= dt * 0.3;
    }
  });
  return (
    <group position={[0, -0.8, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[6, 0.1, 1.2]} />
        <meshStandardMaterial color="#e7d6ff" roughness={0.6} />
      </mesh>
      {/* pillars */}
      {[-2.5, -1, 0.5, 2, 3].map((x) => (
        <mesh key={x} position={[x, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
          <meshStandardMaterial color="#ff7eb3" />
        </mesh>
      ))}
    </group>
  );
}

function Cupcake({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.05;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Machine({ position, color = "#b9dcff" }: { position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#ff5c97" />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffd3e2" emissive="#ff7eb3" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Van() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.x = Math.sin(t * 0.4) * 2;
    }
  });
  return (
    <group ref={ref} position={[0, 0.3, 1.2]}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.5, 0.4]} />
        <meshStandardMaterial color="#ff7eb3" />
      </mesh>
      <mesh position={[0.3, -0.1, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.38]} />
        <meshStandardMaterial color="#ffd3e2" />
      </mesh>
      {[[-0.25, -0.3, 0.22], [-0.25, -0.3, -0.22], [0.25, -0.3, 0.22], [0.25, -0.3, -0.22]].map((p, i) => (
        <mesh key={i} position={p as any} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
          <meshStandardMaterial color="#2a1d2e" />
        </mesh>
      ))}
    </group>
  );
}

export default function Factory3D({ height = 460 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <Canvas shadows camera={{ position: [4, 3, 5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#eef4ff"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 6, 4]} intensity={1.1} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#ffd3e2" />
        <Suspense fallback={null}>
          <ConveyorBelt />
          {[[-2, -0.5, 0.4, "#b9dcff"], [-0.7, -0.5, 0.4, "#ffd3e2"], [0.6, -0.5, 0.4, "#c4f0e2"], [2, -0.5, 0.4, "#ffe7a3"]].map((p, i) => (
            <Machine key={i} position={[p[0] as number, p[1] as number, p[2] as number]} color={p[3] as string} />
          ))}
          <Cupcake position={[-1.5, 0, 0.65]} color="#ff7eb3" />
          <Cupcake position={[0.5, 0, 0.65]} color="#06d6a0" />
          <Cupcake position={[2, 0, 0.65]} color="#ffd166" />
          <Van />
          <ContactShadows position={[0, -1, 0]} opacity={0.3} scale={8} blur={2} far={4} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
