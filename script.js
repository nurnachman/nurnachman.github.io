// Get the cube element
const cube = document.querySelector(".cube");

// Define a function to handle the device orientation event
function handleOrientation(event) {
  // Get the angles of rotation along the x, y, and z axes
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;

  // Update the transform property of the cube element
  // Use the perspective value to create a 3D effect
  // Use the rotateX, rotateY, and rotateZ functions to rotate the cube based on the angles
  cube.style.transform = `perspective(800px) rotateX(${beta}deg) rotateY(${-gamma}deg) rotateZ(${alpha}deg)`;
}

function addOrientationListener() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // Handle iOS 13+ devices.
    DeviceMotionEvent.requestPermission()
      .then((state) => {
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleOrientation);
        } else {
          console.error('Request to access the orientation was rejected');
        }
      })
      .catch(console.error);
  } else {
    // Handle regular non iOS 13+ devices.
    window.addEventListener('devicemotion', handleOrientation);
  }
}