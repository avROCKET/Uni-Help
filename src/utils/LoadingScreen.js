import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LoadingScreen = ({ animationData }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => anim.destroy();
  }, [animationData]);

  return <div ref={animationContainer}></div>;
};

export default LoadingScreen;
