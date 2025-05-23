import { useEffect, useRef, useState } from "react";

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize webcam
  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment" // Prefer back camera if available
        }
      })
      .then(stream => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
      });
  };

  // Capture photo from webcam
  const capturePhoto = () => {
    const video = videoRef.current;
    const photo = photoRef.current;
    
    if (!video || !photo) return;
    
    // Set canvas dimensions proportional to video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    photo.width = videoWidth;
    photo.height = videoHeight;
    
    const ctx = photo.getContext('2d');
    if (!ctx) return;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    setHasPhoto(true);
  };

  // Clear photo
  const clearPhoto = () => {
    const photo = photoRef.current;
    if (!photo) return;
    
    const ctx = photo.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  // Start webcam when component mounts
  useEffect(() => {
    getVideo();
    
    // Cleanup: stop all video streams when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  return {
    videoRef,
    photoRef,
    hasPhoto,
    capturePhoto,
    clearPhoto
  };
};
