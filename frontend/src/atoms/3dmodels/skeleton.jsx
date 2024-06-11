import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import styles from "../../styles/LoaderStyles.module.css";

const SkeletonModel = ({ modelUrl, position }) => {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loader = useMemo(() => new GLTFLoader(), []);
  const scene = useMemo(() => new THREE.Scene(), []);
  const dloader = new DRACOLoader();
  dloader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
  );
  dloader.setDecoderConfig({ type: "js" });
  loader.setDRACOLoader(dloader);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    // const light = new THREE.DirectionalLight(0xffffff, 10);
    // light.position.set(0, 0, 6);
    // camera.add(light);
    // scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableRotate = true;
    controls.enableZoom = true;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.render(scene, camera);

    const loader2 = new RGBELoader();
    loader2.load(
      "/3DModels/christmas_photo_studio_04_1k.hdr",
      function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environment.intensity = 1;
      }
    );
    const startLoadTime = performance.now();

    loader.load(
      modelUrl,
      (gltf) => {
        const skeleton = gltf.scene;
        skeleton.position.set(...position);
        skeleton.scale.set(2, 2, 2);
        skeleton.rotateY(1.6);
        scene.add(skeleton);

        setIsLoading(false);
        const endLoadTime = performance.now();
        console.log(
          `Model load time: ${(endLoadTime - startLoadTime).toFixed(2)} ms`
        );
      },
      undefined,
      function (error) {
        setError(error);
      }
    );

    function tick() {
      window.requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    }

    tick();

    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener("resize", handleResize);
  }, [loader, scene, modelUrl, position]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {isLoading && !error && (
        <div
          className={styles.loaderContainer}
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
          }}
        >
          <svg className={styles.svg} viewBox="25 25 50 50">
            <circle className={styles.circle} r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      )}
      {error && (
        <div style={{ color: "red", width: "50%", textAlign: "center" }}>
          Error loading model: {error.message}
        </div>
      )}
      {!error && (
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%" }}
        ></canvas>
      )}
    </div>
  );
};

export default SkeletonModel;
