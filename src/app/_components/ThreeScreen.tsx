'use client'

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function lerp(x: number, y: number, a: number) {
    return (1 - easeInOutSine(a)) * x + easeInOutSine(a) * y;
}

function easeInOutSine(t: number) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}

function piMultiple(num: number): number {
    const round = Math.round(num / (2 * Math.PI));
    return round * (2 * Math.PI) - (Math.PI / 2)
}

const ThreeScene: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const cabinetRef = useRef<THREE.Group | null>(null);
    const floorRef = useRef<THREE.Group | null>(null);
    const [isIdle, setIdle] = useState<boolean>(true);
    const isIdleRef = useRef(isIdle);
    let cabinet: THREE.Group | null = null;
    let floor: THREE.Group | null = null;

    useEffect(() => {
        isIdleRef.current = isIdle;
    }, [isIdle]);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    function animate() {
        requestAnimationFrame(animate);
        if (cabinetRef.current && isIdleRef.current) {

            cabinetRef.current.rotation.y += 0.01; // Adjust the rotation speed as desired
        }
        renderer.render(scene, camera);
    }

    function beginAnimation() {
        const DURATION = 1;
        const FPS = 100;

        if (!isIdle) return;
        setIdle(false);

        if (cabinet) {
            let counter = 0
            const posX = cabinet.position.x;
            const posY = cabinet.position.y;
            const posZ = cabinet.position.z;
            const rotX = cabinet.rotation.x;
            const rotY = cabinet.rotation.y;
            const interval = setInterval(() => {
                if (counter >= 1) {
                    clearInterval(interval);
                    return;
                }
                if (cabinet) {
                    cabinet.position.x = lerp(posX, 0, counter)
                    cabinet.position.y = lerp(posY, -3.67, counter)
                    cabinet.position.z = lerp(posZ, 3.6, counter)
                    cabinet.rotation.x = lerp(rotX, 0.18, counter)
                    cabinet.rotation.y = lerp(rotY, piMultiple(rotY), counter)
                }
                counter += (1 / (FPS * DURATION));
            }, 1000 / FPS)
        }
    }

    useEffect(() => {
        renderer.setPixelRatio(window.devicePixelRatio * 2);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.domElement);

        const loader = new GLTFLoader();

        camera.position.set(0, 0, 5)
        const light = new THREE.AmbientLight(0xffffff, 1); // White light with intensity
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        scene.add(light);
        scene.add(directionalLight);

        loader.load('/cabinet.glb', (glb) => {
            cabinet = glb.scene; // Cast to Group
            scene.add(cabinet);
            cabinet.position.set(-4, -2.5, -1)
            cabinet.rotation.y = -(Math.PI / 2);

            // Store the cabinet reference for later use
            cabinetRef.current = cabinet;
        });

        loader.load('/box.glb', (glb) => {
            floor = glb.scene; // Cast to Group
            scene.add(floor);
            floor.position.set(0, 0, 0)
            floor.rotation.set(0, 0, 0)


            floorRef.current = floor;
        });
        animate();

        const currMount = mountRef.current;

        return () => {
            renderer.dispose();
            currMount?.removeChild(renderer.domElement);
        };
    }, []);

    return <div className='w-[100vw] h-[100vh]' ref={mountRef} />;
};

export default ThreeScene;