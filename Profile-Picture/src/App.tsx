import { useState, useEffect, useRef } from 'react';

const App = ({
    size = 200,
    initialsProp = "RZ",
    bgColorProp = "#f0f0f0",
    lineColorProp = "#1a1a1a"
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isAnimating, setIsAnimating] = useState(true);
    // Lifted state (though initially props were used, we want controls so we need state)
    const [initials, setInitials] = useState(initialsProp);
    const [bgColor, setBgColor] = useState(bgColorProp);
    const [lineColor, setLineColor] = useState(lineColorProp);

    const downloadAvatar = (exportSize: number) => {
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx) return;

        const dpr = 2;
        exportCanvas.width = exportSize * dpr;
        exportCanvas.height = exportSize * dpr;

        exportCtx.scale(dpr, dpr);

        const centerX = exportSize / 2;
        const centerY = exportSize / 2;
        const maxRadius = exportSize / 2;

        exportCtx.clearRect(0, 0, exportSize, exportSize);

        exportCtx.save();
        exportCtx.beginPath();
        exportCtx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
        exportCtx.clip();

        exportCtx.fillStyle = bgColor;
        exportCtx.fillRect(0, 0, exportSize, exportSize);

        exportCtx.save();
        exportCtx.translate(centerX, centerY);

        const numLines = 12;
        const drawRadius = maxRadius * 0.85;

        exportCtx.strokeStyle = lineColor;
        exportCtx.lineWidth = 3;

        for (let i = 0; i < numLines; i++) {
            const angle = (Math.PI * 2 * i) / numLines;

            exportCtx.beginPath();
            for (let r = 0; r < drawRadius; r += 4) {
                const spiralAngle = angle + (r / drawRadius) * Math.PI;
                const x = Math.cos(spiralAngle) * r;
                const y = Math.sin(spiralAngle) * r;
                if (r === 0) exportCtx.moveTo(x, y);
                else exportCtx.lineTo(x, y);
            }
            exportCtx.stroke();

            exportCtx.beginPath();
            const orbX = Math.cos(angle) * drawRadius * 0.9;
            const orbY = Math.sin(angle) * drawRadius * 0.9;
            exportCtx.arc(orbX, orbY, 8, 0, Math.PI * 2);
            exportCtx.fillStyle = lineColor;
            exportCtx.fill();
        }

        exportCtx.restore();

        exportCtx.beginPath();
        exportCtx.arc(centerX, centerY, exportSize * 0.25, 0, Math.PI * 2);
        exportCtx.fillStyle = bgColor;
        exportCtx.fill();
        exportCtx.strokeStyle = lineColor;
        exportCtx.lineWidth = 6;
        exportCtx.stroke();

        exportCtx.font = `bold ${exportSize * 0.2}px Arial, sans-serif`;
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.fillStyle = lineColor;
        exportCtx.fillText(initials, centerX, centerY);

        exportCtx.restore();

        exportCanvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `avatar-${exportSize}x${exportSize}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    const downloadBanner = () => {
        const bannerWidth = 1280;
        const bannerHeight = 320;
        const bannerCanvas = document.createElement('canvas');
        const bannerCtx = bannerCanvas.getContext('2d');
        if (!bannerCtx) return;

        const dpr = 2;
        bannerCanvas.width = bannerWidth * dpr;
        bannerCanvas.height = bannerHeight * dpr;

        bannerCtx.scale(dpr, dpr);

        // Background gradient
        const gradient = bannerCtx.createLinearGradient(0, 0, bannerWidth, bannerHeight);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#d0d0d0');
        bannerCtx.fillStyle = gradient;
        bannerCtx.fillRect(0, 0, bannerWidth, bannerHeight);

        // Draw avatar on the left
        const avatarSize = 200;
        const avatarX = 80;
        const avatarY = (bannerHeight - avatarSize) / 2;

        bannerCtx.save();
        bannerCtx.beginPath();
        bannerCtx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        bannerCtx.clip();

        bannerCtx.fillStyle = bgColor;
        bannerCtx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

        bannerCtx.save();
        bannerCtx.translate(avatarX + avatarSize / 2, avatarY + avatarSize / 2);

        const numLines = 12;
        const drawRadius = avatarSize * 0.85 / 2;

        bannerCtx.strokeStyle = lineColor;
        bannerCtx.lineWidth = 2;

        for (let i = 0; i < numLines; i++) {
            const angle = (Math.PI * 2 * i) / numLines;

            bannerCtx.beginPath();
            for (let r = 0; r < drawRadius; r += 3) {
                const spiralAngle = angle + (r / drawRadius) * Math.PI;
                const x = Math.cos(spiralAngle) * r;
                const y = Math.sin(spiralAngle) * r;
                if (r === 0) bannerCtx.moveTo(x, y);
                else bannerCtx.lineTo(x, y);
            }
            bannerCtx.stroke();

            bannerCtx.beginPath();
            const orbX = Math.cos(angle) * drawRadius * 0.9;
            const orbY = Math.sin(angle) * drawRadius * 0.9;
            bannerCtx.arc(orbX, orbY, 6, 0, Math.PI * 2);
            bannerCtx.fillStyle = lineColor;
            bannerCtx.fill();
        }

        bannerCtx.restore();

        bannerCtx.beginPath();
        bannerCtx.arc(0, 0, avatarSize * 0.25, 0, Math.PI * 2);
        bannerCtx.fillStyle = bgColor;
        bannerCtx.fill();
        bannerCtx.strokeStyle = lineColor;
        bannerCtx.lineWidth = 4;
        bannerCtx.stroke();

        bannerCtx.font = `bold ${avatarSize * 0.15}px Arial, sans-serif`;
        bannerCtx.textAlign = 'center';
        bannerCtx.textBaseline = 'middle';
        bannerCtx.fillStyle = lineColor;
        bannerCtx.fillText(initials, 0, 0);

        bannerCtx.restore();
        bannerCtx.restore();

        // Add text on the right
        const textX = avatarX + avatarSize + 60;
        const textY = bannerHeight / 2;

        bannerCtx.fillStyle = lineColor;
        bannerCtx.font = 'bold 48px Arial, sans-serif';
        bannerCtx.textAlign = 'left';
        bannerCtx.textBaseline = 'middle';
        bannerCtx.fillText('RetroZenith', textX, textY - 30);

        bannerCtx.font = '28px Arial, sans-serif';
        bannerCtx.fillStyle = '#555';
        bannerCtx.fillText('Open Source Enthusiast', textX, textY + 30);

        // Decorative line
        bannerCtx.strokeStyle = lineColor;
        bannerCtx.lineWidth = 3;
        bannerCtx.beginPath();
        bannerCtx.moveTo(textX, textY);
        bannerCtx.lineTo(textX + 400, textY);
        bannerCtx.stroke();

        bannerCanvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `banner-github-1280x320.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;

        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        ctx.scale(dpr, dpr);

        const centerX = size / 2;
        const centerY = size / 2;
        const maxRadius = size / 2;

        let rotation = 0;
        let time = 0;
        let animationFrameId: number;

        const render = () => {
            // Note: We used to return if !isAnimating, but then it clears or stops updating.
            // If we want it to stop spinning, we just don't increment rotation?
            // Original code: if (!isAnimating) return; -> This stops the loop completely.
            // But if we toggle back on, we need to restart the loop.
            // Better: loop always runs, but update depends on isAnimating.
            // However, looking at original code:
            // useEffect depended on [isAnimating]. If changed, it clears effect (cancel animation) and reruns.
            // So logic was: if isAnimating is true, run loop. If false, effect re-runs?
            // Wait, original: `if (!isAnimating) return;` inside render.
            // If `isAnimating` was false initially, render returns immediately.
            // If it becomes true, effect re-runs.
            // Actually, if `isAnimating` enters dependencies, entire effect re-runs.

            // Let's keep loop structure but handle non-animating state better or trust re-run.
            // In original code: `if (!isAnimating) return;` meant it draws once? No, it stops loop.
            // But we need to draw at least once even if static.

            ctx.clearRect(0, 0, size, size);

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
            ctx.clip();

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, size);

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            const scalePulse = 1 + Math.sin(time) * 0.05;
            ctx.scale(scalePulse, scalePulse);

            const numLines = 12;
            const drawRadius = maxRadius * 0.85;

            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1.5;

            for (let i = 0; i < numLines; i++) {
                const angle = (Math.PI * 2 * i) / numLines;

                ctx.beginPath();
                for (let r = 0; r < drawRadius; r += 4) {
                    const spiralAngle = angle + (r / drawRadius) * Math.PI;
                    const x = Math.cos(spiralAngle) * r;
                    const y = Math.sin(spiralAngle) * r;
                    if (r === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                ctx.beginPath();
                const orbX = Math.cos(angle) * drawRadius * 0.9;
                const orbY = Math.sin(angle) * drawRadius * 0.9;
                ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
                ctx.fillStyle = lineColor;
                ctx.fill();
            }

            ctx.restore();

            ctx.beginPath();
            ctx.arc(centerX, centerY, size * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = bgColor;
            ctx.fill();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.font = `bold ${size * 0.2}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = lineColor;
            ctx.fillText(initials, centerX, centerY);

            ctx.restore();

            if (isAnimating) {
                rotation += 0.002;
                time += 0.05;
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [size, initials, bgColor, lineColor, isAnimating]);

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50">
            <div
                className="rounded-full shadow-lg overflow-hidden border-4 border-white ring-2 ring-gray-200"
                style={{ width: size, height: size }}
            >
                <canvas ref={canvasRef} />
            </div>

            <div className="mt-8 space-y-4 w-full max-w-md">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Customize</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Initials</label>
                            <input
                                type="text"
                                value={initials}
                                onChange={(e) => setInitials(e.target.value.substring(0, 3))}
                                className="w-full px-3 py-2 border rounded-md"
                                maxLength={3}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bg Color</label>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="h-9 w-full rounded-md cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Line Color</label>
                                <input
                                    type="color"
                                    value={lineColor}
                                    onChange={(e) => setLineColor(e.target.value)}
                                    className="h-9 w-full rounded-md cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap justify-center">
                    <button
                        onClick={() => downloadAvatar(256)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm"
                    >
                        256px
                    </button>

                    <button
                        onClick={() => downloadAvatar(512)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm"
                    >
                        512px
                    </button>

                    <button
                        onClick={() => downloadAvatar(1024)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-semibold text-sm"
                    >
                        1024px (GitHub)
                    </button>
                </div>

                <div className="mt-6">
                    <button
                        onClick={downloadBanner}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md font-semibold"
                    >
                        📱 Download Banner
                    </button>
                </div>

                <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
                >
                    {isAnimating ? 'Pause Animation' : 'Start Animation'}
                </button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                        <strong>How to upload to GitHub:</strong><br />
                        <strong>Avatar:</strong> Settings → Public profile → Click on avatar<br />
                        <strong>Banner:</strong> Settings → Public profile → Edit profile → Background image
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
