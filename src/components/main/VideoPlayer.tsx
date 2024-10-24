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
