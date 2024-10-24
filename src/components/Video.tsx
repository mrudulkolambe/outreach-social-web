import { useState, useRef, useEffect } from 'react';
import VideoPlayer from './main/VideoPlayer';
import videojs from 'video.js';

const VideoComponent = ({ videoUrl, isPopup }: { videoUrl: string, isPopup: boolean }) => {
	const [isVideoInView, setIsVideoInView] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const playerRef = useRef(null);

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
		if (videoRef.current && !isVideoInView) {
			videoRef.current.pause();
		}
	}, [isVideoInView]);

	const videoJsOptions = {
		autoplay: true,
		controls: false,
		responsive: true,
		fluid: true,
		sources: [{
			src: videoUrl,
			type: 'application/x-mpegURL'
		}],
	};

	const handlePlayerReady = (player: any) => {
		playerRef.current = player;

		player.on('waiting', () => {
			videojs.log('player is waiting');
		});

		player.on('dispose', () => {
			videojs.log('player will dispose');
		});
	};
	return (
		<div>
			<VideoPlayer isPopup={isPopup} options={videoJsOptions} onReady={handlePlayerReady} />
		</div>
	);
};

export default VideoComponent;
