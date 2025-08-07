import React, { useEffect, useRef, memo } from 'react';
import Webamp from 'webamp';

const WinampPlayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const webampRef = useRef<Webamp | null>(null);

  useEffect(() => {
    console.log(`[WINAMP DEBUG] WinampPlayer useEffect triggered`);
    if (!containerRef.current) {
      console.log(`[WINAMP DEBUG] No container ref, returning`);
      return;
    }

    const initWebamp = async () => {
      console.log(`[WINAMP DEBUG] Initializing Webamp`);
      try {
        const webamp = new Webamp({
          initialTracks: [
            {
              metaData: {
                artist: "DJ Mike Llama",
                title: "Llama Whippin' Intro",
              },
              url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82/mp3/llama-2.91.mp3",
              duration: 5.322286,
            },
          ],
        });

        // Store webamp instance
        webampRef.current = webamp;
        console.log(`[WINAMP DEBUG] Webamp instance created`);

        // Render Webamp
        if (containerRef.current) {
          console.log(`[WINAMP DEBUG] Rendering Webamp to container`);
          await webamp.renderWhenReady(containerRef.current);
          console.log(`[WINAMP DEBUG] Webamp rendered successfully`);
        }

        // Cleanup on unmount
        return () => {
          console.log(`[WINAMP DEBUG] WinampPlayer cleanup`);
          if (webampRef.current) {
            webampRef.current.dispose();
          }
        };
      } catch (error) {
        console.error('Error initializing Webamp:', error);
      }
    };

    initWebamp();
  }, []);

  console.log(`[WINAMP DEBUG] WinampPlayer render`);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default memo(WinampPlayer);