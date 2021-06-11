import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Sky, useFBX } from "@react-three/drei";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import create from "zustand";
import { Vector3 } from "three";

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));

  return (
    <mesh receiveShadow={true} ref={ref}>
      <planeGeometry args={[256, 256]} />
      <meshStandardMaterial color="#040033" />
    </mesh>
  );
}

const useCubeStore = create((set) => ({
  cubes: [],
  addCube: (x, y, z) =>
    set((state) => ({ cubes: [...state.cubes, [x, y, z]] })),
}));

export const Cubes = () => {
  const cubes = useCubeStore((state) => state.cubes);
  return cubes.map((coords, index) => <Cube key={index} position={coords} />);
};

function Cube(props) {
  const [ref] = useBox(() => ({ mass: 12, ...props }));

  return (
    <mesh receiveShadow={true} castShadow={true} ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="" />
    </mesh>
  );
}

const usePlayerControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const moveFieldByKey = (key) =>
    ({
      KeyW: "forward",
      KeyS: "backward",
      KeyA: "left",
      KeyD: "right",
      Space: "jump",
    }[key]);

  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};

export const User = (props) => {
  const direction = new Vector3();
  const frontVector = new Vector3();
  const sideVector = new Vector3();

  const [ref, api] = useSphere(() => ({
    mass: 65,
    type: "Dynamic",
    position: [0, 5, 0],
    ...props,
  }));
  const { forward, backward, left, right, jump } = usePlayerControls();
  const { camera } = useThree();
  const velocity = useRef([0, 0, 0]);
  const fbx = useFBX("assets/characters/user.fbx");

  useEffect(
    () => void api.velocity.subscribe((v) => (velocity.current = v)),
    []
  );

  useFrame(() => {
    camera.position.copy(ref.current.position);
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(5)
      .applyEuler(camera.rotation);
    api.velocity.set(direction.x, velocity.current[1], direction.z);
    if (jump && Math.abs(+velocity.current[1].toFixed(2)) < 0.05)
      api.velocity.set(velocity.current[0], 10, velocity.current[2]);
  });

  return (
    <mesh receiveShadow={true} castShadow={true} ref={ref} {...fbx.children[0]}>
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

function App() {
  const addCube = useCubeStore((state) => state.addCube);

  useEffect(() => {
    addCube(-0.45, 9, 0.25);
  });

  return (
    <div className={"Canvas"}>
      <Canvas dpr={[1, 2]} gl={{ alpha: false }} shadows camera={{ fov: 35 }}>
        <Sky sunPosition={[100, 10, 100]} />
        <ambientLight intensity={0.3} />
        <spotLight
          angle={0.25}
          penumbra={0.5}
          position={[10, 10, 5]}
          castShadow={true}
        />
        <pointLight
          castShadow={true}
          intensity={0.8}
          position={[100, 100, 100]}
        />
        <Physics gravity={[0, -30, 0]}>
          <Plane />
          <User />
          <Cubes />
        </Physics>
        <PointerLockControls />
      </Canvas>
    </div>
  );
}

export default App;
