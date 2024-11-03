"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { animateVRM } from "./Animate";

interface Props {
  landmarks: any; // Add the type according to your data structure
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const VrmModelViewer: React.FC<Props> = ({
  landmarks,
  videoRef,
  containerRef,
}) => {
  const currentVrmRef = useRef<any>(null);
  const landmarksRef = useRef<any>(null);

  useEffect(() => {
    landmarksRef.current = landmarks;
  }, [landmarks]);

  useEffect(() => {
    // renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const w = 500;
    const h = window.innerHeight;

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current?.appendChild(renderer.domElement);

    // camera
    const orbitCamera = new THREE.PerspectiveCamera(35, w / h, 0.1, 1000);
    orbitCamera.position.set(0.0, 1.4, 2.7);

    // controls
    const orbitControls = new OrbitControls(orbitCamera, renderer.domElement);
    orbitControls.screenSpacePanning = true;
    orbitControls.target.set(0.0, 0.9, 0.0);
    orbitControls.update();

    // scene
    const scene = new THREE.Scene();

    // light
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(light);

    // Main Render Loop
    const clock = new THREE.Clock();

    /* VRM CHARACTER SETUP */
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";

    loader.register((parser: any) => {
      return new VRMLoaderPlugin(parser);
    });

    loader.load(
      "/models/avatar_a.vrm",
      (gltf: any) => {
        const vrm = gltf.userData.vrm;

        vrm.humanoid.getNormalizedBoneNode("leftUpperArm").rotation.z = 1.4;
        vrm.humanoid.getNormalizedBoneNode("rightUpperArm").rotation.z = -1.4;

        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        vrm.scene.traverse((obj: any) => {
          obj.frustumCulled = false;
        });

        scene.add(vrm.scene);
        currentVrmRef.current = vrm;
        vrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
        console.log("Loaded model");
      },
      undefined,
      (error: any) => console.error("Error loading VRM model:", error),
    );

    function animate() {
      requestAnimationFrame(animate);

      const currentVrm = currentVrmRef.current; // Access the current VRM from the ref
      const landmarks = landmarksRef.current;

      if (currentVrm && landmarks) {
        animateVRM(currentVrm, landmarks, videoRef);
        currentVrm.update(clock.getDelta());
      }
      renderer.render(scene, orbitCamera);
    }

    animate();
  }, []);

  return null; // Render nothing since the canvas is appended to the body
};

export default VrmModelViewer;
