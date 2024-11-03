'use client'

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
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

            cabinetRef.current.rotation.y += 0.005; // Adjust the rotation speed as desired
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
            const camX = camera.position.x
            const camY = camera.position.y
            const camZ = camera.position.z
            const camRot = cabinet.rotation.x;
            const cabRot = cabinet.rotation.y;
            const interval = setInterval(() => {
                if (counter >= 1) {
                    clearInterval(interval);
                    setTimeout(() => {
                        router.push('/play');
                    }, 1000);
                    return;
                }
                if (cabinet) {
                    camera.position.set(lerp(camX, -3, counter), lerp(camY, 1.3, counter), lerp(camZ, 0.5, counter))
                    cabinet.rotation.y = lerp(cabRot, piMultiple(cabRot), counter)
                    camera.rotation.x = lerp(camRot, -0.15, counter)
                }
                counter += (1 / (FPS * DURATION));
            }, 1000 / FPS)
        }
    }

    const handleScroll = (event: Event) => {
        const delta = (event as WheelEvent).deltaY;
        if (delta < 0) {
            camera.position.z = Math.max(camera.position.z + (delta * 0.01), 4);
        } else {
            camera.position.z = Math.min(camera.position.z + (delta * 0.01), 6);
        }
    }

    useEffect(() => {
        renderer.setPixelRatio(window.devicePixelRatio * 2);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        mountRef.current?.appendChild(renderer.domElement);

        const loader = new GLTFLoader();

        camera.position.set(0, 0, 5)
        const light = new THREE.AmbientLight(0xffffff, 0.5); 
        const dirLight = new THREE.DirectionalLight(0xffffff, 2)
        const spotlight = new THREE.SpotLight(
            0xFFFFFF, 10.0, 10.0, (Math.PI / 4), 1, 0
        )
        dirLight.position.set(1, 2, 0)
        dirLight.target.position.set(0, 0, 0)
        dirLight.castShadow = true;

        spotlight.position.set(0, 2, 1)
        spotlight.target.position.set(0, 0, 0)
        spotlight.castShadow = true;

        scene.add(light)
        scene.add(dirLight)
        scene.add(dirLight.target)
        scene.add(spotlight)
        scene.add(spotlight.target)

        loader.load('/cabinet.glb', (glb) => {
            cabinet = glb.scene; 
            cabinet.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true; 
                    child.receiveShadow = true;
                }
            });
            scene.add(cabinet);
            cabinet.position.set(-3, -1.5, 0)
            cabinet.rotation.y = -(Math.PI / 2);
            cabinet.scale.set(0.7, 0.7, 0.7)

            cabinetRef.current = cabinet;
        });

        loader.load('/box.glb', (glb) => {
            floor = glb.scene; 
            floor.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.receiveShadow = true;
                }
            });
            scene.add(floor);
            floor.position.set(0, -2.5, 0)
            floor.rotation.set(0, 0, 0)


            floorRef.current = floor;
        });

        animate();       

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('click', beginAnimation)

        const currMount = mountRef.current;

        return () => {
            renderer.dispose();
            currMount?.removeChild(renderer.domElement);
            window.removeEventListener('wheel', handleScroll)
            window.removeEventListener('click', beginAnimation)
        };
    }, []);

    return <div className='w-[100vw] h-[100vh]' ref={mountRef} />;
};

export default ThreeScene;