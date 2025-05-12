import React, { useEffect, useRef } from 'react';
import { createWorker } from 'tesseract.js';
const worker = await createWorker("eng")
import { useState } from 'react';


// const worker = await createWorker("eng")
// // Updated video config
// const scaleFactor = 1.5; // Adjust this factor to enlarge proportionally

// const vidWidth = (window.innerWidth - 60) * scaleFactor;
// const vidHeight = 260 * scaleFactor;
// const vidOffsetTop = 240 * scaleFactor;
// const vidOffsetLeft = ((window.innerWidth) / 2) - (vidWidth / 2);

// // Updated indicator config
// const marginX = 40 * scaleFactor;
// const indWidth = vidWidth - marginX;
// const indHeight = 580;
// const indOffsetTop = vidOffsetTop + (vidHeight / 2) - (indHeight / 2);
// const indOffsetLeft = (window.innerWidth / 2) - (indWidth / 2);


const App = ({ setCode, setScanning }) => {
     const [buttonClicked, setButtonClicked] = useState(false); // Track button click
    
// Updated video config
const scaleFactor = 1.5; // Adjust this factor to enlarge proportionally

const vidWidth = (window.innerWidth - 60) * scaleFactor;
const vidHeight = 260 * scaleFactor;
const vidOffsetTop = 240 * scaleFactor;
const vidOffsetLeft = ((window.innerWidth) / 2) - (vidWidth / 2);

// Updated indicator config
const marginX = 40 * scaleFactor;
const indWidth = vidWidth - marginX;
const indHeight = 580;
const indOffsetTop = vidOffsetTop + (vidHeight / 2) - (indHeight / 2);
const indOffsetLeft = (window.innerWidth / 2) - (indWidth / 2);
    const myVideo = useRef();
    const myStream = useRef();
    const scannedCodes = useRef();

    useEffect(() => {
        if (myVideo && myVideo.current) {
            navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            })
            .then(stream => {
                myVideo.current.srcObject = stream;
                myVideo.current.onloadedmetadata = () => {
                myVideo.current.play().catch(err => console.error("Video play error:", err));
              };
                myStream.current = stream;
                scannedCodes.current = {};

                (async () => {
                    // await worker.load();
                    // await worker.loadLanguage("eng");
                    // await worker.initialize("eng");
                    requestAnimationFrame(tick);
                })()
            })
            .catch(err => {
                console.error(err);
                // handle error here with popup
            })
        }

        return () => myStream && myStream.current && myStream.current.getTracks().forEach(x => x.stop());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tick = async () => {
      console.log("I came here");
      console.log(myVideo && myVideo.current && myVideo.current.readyState === myVideo.current.HAVE_ENOUGH_DATA);
      
      if(true){
        // if (myVideo && myVideo.current && myVideo.current.readyState === myVideo.current.HAVE_ENOUGH_DATA) {
            // canvas
            const canvas = document.createElement("canvas");
            canvas.width = indWidth+500;
            canvas.height = indHeight +500;

            const image = myVideo.current;
            // source 
            const sx = (marginX / 2) / 2;
            const sy = vidHeight - indHeight;
            const sWidth = indWidth * 2;
            const sHeight = indHeight * 2;
            // destination
            const dx = 0;
            const dy = 0;
            const dWidth = indWidth;
            const dHeight = indHeight;

          //   canvas.getContext("2d").drawImage(
          //     image, 
          //     (marginX / 2) / 2, 
          //     vidHeight - indHeight, 
          //     (indWidth * scaleFactor)+500, 
          //     indHeight * scaleFactor, 
          //     0, 
          //     0, 
          //     indWidth, 
          //     indHeight
          // );
          canvas.getContext("2d")
          .drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

            // tesseract
            const { data: { text } } = await worker.recognize(canvas);
            const regex = /[a-zA-Z0-9]/gi;
            const scannedText = text && text.match(regex) && text.match(regex).filter(x => x).join("");
            console.log({text, scannedText});
            console.log("Captured frame:", canvas.toDataURL());

            requestAnimationFrame(tick);
        }
        // }
    };

    return (

        <div>
            <h1>HIIII</h1>
           {/* <button onClick={() => tick()}>Start Scanning</button> */}
           <button onClick={() => myVideo.current?.play()}>Start Video</button>

            <video
                ref={myVideo}
                muted
                autoPlay
                playsInline
                width={vidWidth}
                height={vidHeight}
                style={{
                    position: "absolute",
                    top: vidOffsetTop ,
                    left: vidOffsetLeft,
                    zIndex: 2
                }}
            ></video>
            <div
                style={{
                    width: indWidth,
                    height: indHeight,
                    border: "1px red solid",
                    zIndex: 3,
                    position: "absolute",
                    top: indOffsetTop,
                    left: indOffsetLeft
                }}
            ></div>
        </div>
    )
};

export default App;
