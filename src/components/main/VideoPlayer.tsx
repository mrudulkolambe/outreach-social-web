import { RefreshCcw } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoPlayer = (props: any) => {
    const videoRef = useRef<any | undefined>(undefined);
    const playerRef = useRef<any | null>(null);
    const [isVideoInView, setIsVideoInView] = useState<boolean>(false);
    const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
    const { options, onReady, isPopup } = props;

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');
            videoElement.classList.add('h-full');
            videoRef.current?.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });

            player.on('ended', () => {
                setIsVideoEnded(true);
            });
        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player
            player.src(options.sources);
        }
    }, [options, videoRef]);

    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVideoInView(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (playerRef.current && !isVideoInView) {
            playerRef.current.pause();
        }
    }, [isVideoInView]);

    const handleReplay = () => {
        const player = playerRef.current;
        if (player) {
            player.currentTime(0); // Restart the video from the beginning
            player.play(); // Play the video again
            setIsVideoEnded(false); // Hide the replay button when the video starts again
        }
    };

    return (
        <div data-vjs-player className={twMerge('relative flex items-center justify-center overflow-hidden rounded-xl', isPopup ? "h-[90vh]" : "h-[402px]")}>
            {isVideoEnded && (
                <button
                    onClick={handleReplay}
                    className="z-50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 backdrop-blur flex items-center justify-center"
                >
                    <RefreshCcw className='text-white' />
                </button>
            )}
            <div ref={videoRef} className={twMerge("bg-red-400 object-contain w-full", isPopup ? "h-[90vh]" : "h-[402px]")} />
        </div>
    );
}

export default VideoPlayer;


// import { useRef, useEffect, useState } from 'react';
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';

// interface VideoPlayerProps {
//     videoUrl: string; // URL of the .m3u8 video
//     onReady?: (player: any) => void; // Callback when the player is ready
// }

// export const VideoPlayer = ({ videoUrl, onReady }: VideoPlayerProps) => {
//     const videoRef = useRef<HTMLDivElement | null>(null);
//     const playerRef = useRef<any | null>(null);
//     const [isVideoInView, setIsVideoInView] = useState<boolean>(false);
//     const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);

//     useEffect(() => {
//         if (!playerRef.current) {
//             const videoElement = document.createElement("video-js");
//             videoElement.classList.add('vjs-big-play-centered', 'h-full');
//             videoRef.current?.appendChild(videoElement);

//             const player = (playerRef.current = videojs(videoElement, {
//                 controls: true,
//                 autoplay: false,
//                 preload: 'auto',
//                 fluid: true, // Ensures responsive sizing
//                 sources: [{ src: videoUrl,}], // Native HLS support
//             }, () => {
//                 videojs.log('Player is ready');
//                 onReady?.(player);
//             }));

//             // Listen for video end event
//             player.on('ended', () => setIsVideoEnded(true));
//         } else {
//             const player = playerRef.current;
//             player.src({ src: videoUrl});
//         }
//     }, [videoUrl]);

//     // Observe whether the video is in the viewport
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 setIsVideoInView(entry.isIntersecting);
//             },
//             { root: null, rootMargin: '0px', threshold: 0.5 }
//         );

//         if (videoRef.current) {
//             observer.observe(videoRef.current);
//         }

//         return () => {
//             observer.disconnect();
//         };
//     }, []);

//     // Pause video when it is not in view
//     useEffect(() => {
//         if (playerRef.current && !isVideoInView) {
//             playerRef.current.pause();
//         }
//     }, [isVideoInView]);

//     // Cleanup on unmount
//     useEffect(() => {
//         return () => {
//             if (playerRef.current && !playerRef.current.isDisposed()) {
//                 playerRef.current.dispose();
//                 playerRef.current = null;
//             }
//         };
//     }, []);

//     // Handle video replay
//     const handleReplay = () => {
//         if (playerRef.current) {
//             playerRef.current.currentTime(0);
//             playerRef.current.play();
//             setIsVideoEnded(false);
//         }
//     };

//     return (
//         <div data-vjs-player>
//             <div ref={videoRef} />
//             {isVideoEnded && (
//                 <button onClick={handleReplay} className="replay-button">
//                     Replay
//                 </button>
//             )}
//         </div>
//     );
// };

// export default VideoPlayer;