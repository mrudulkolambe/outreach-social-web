import { useRef, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const VideoPlayer = (props: any) => {
    const videoRef = useRef<any | undefined>(undefined);
    const playerRef = useRef<any | null>(null);
    const [isVideoInView, setIsVideoInView] = useState<boolean>(false);
    const { options, onReady, isPopup } = props;

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current?.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });
        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
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

    return (
        <div data-vjs-player className='h-full overflow-hidden'>
            <div ref={videoRef} className={twMerge('object-fill w-full', isPopup ? "h-full" : "h-[402px] rounded-xl")} />
        </div>
    );
}

export default VideoPlayer;
