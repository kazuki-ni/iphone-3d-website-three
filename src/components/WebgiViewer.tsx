import { useRef, useCallback, useEffect } from "react";
import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    GammaCorrectionPlugin,
    BloomPlugin,
    Vector3
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger)

function WebgiViewer() {
    const canvasRef = useRef(null);

    const memorizeScrollAnimation = useCallback((position: Vector3, target: Vector3, onUpdate: () => void) => {
        if (position && target && onUpdate) {
            scrollAnimation(position, target, onUpdate)
        }
    }, [])

    const setupViewer = useCallback(async () => {
        const viewer = new ViewerApp({
            canvas: canvasRef.current || undefined,
        })

        const manager = await viewer.addPlugin(AssetManagerPlugin)

        const camera = viewer.scene.activeCamera
        const position = camera.position
        const target = camera.target

        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new ProgressivePlugin(32))
        await viewer.addPlugin(new TonemapPlugin(true))
        await viewer.addPlugin(GammaCorrectionPlugin)
        await viewer.addPlugin(SSRPlugin)
        await viewer.addPlugin(SSAOPlugin)
        await viewer.addPlugin(BloomPlugin)

        viewer.renderer.refreshPipeline()

        await manager.addFromPath("scene-black.glb")

        const tonemapPlugin = viewer.getPlugin(TonemapPlugin)
        if (tonemapPlugin?.config?.clipBackground !== undefined) {
            tonemapPlugin.config.clipBackground = true
        }

        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

        window.scrollTo(0, 0);

        let needUpdate = true;
        const onUpdate = () => {
            needUpdate = true;
            viewer.setDirty()
        }

        viewer.addEventListener("preFrame", () => {
            if (needUpdate) {
                camera.positionTargetUpdated(true)
                needUpdate = false
            }
        })

        memorizeScrollAnimation(position, target, onUpdate)
    }, [])

    useEffect(() => {
        setupViewer()
    }, [])

    return (
        <div id="webgi-canvas-container">
            <canvas id="webgi-canvas" ref={canvasRef} />
        </div>
    );
}

export default WebgiViewer;