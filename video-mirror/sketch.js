let turkey;

function setup() {
  createCanvas(400, 400);
  
  turkey = createCapture('VIDEO', captureCallback);
  turkey.hide();
}

function captureCallback(s) {
  initwebrtc(s);
}

function draw() {
  background(220);

    image(turkey, 0, 0);

  loadPixels();
  for (let i = 0; i < pixels.length; i+=4) {
    let r = pixels[i];
    let g = pixels[i+1];
    let b = pixels[i+2];
    
    // There is probably a better way to do threshold?
    if (r+b+g > 200) {
      pixels[i] = 255;
      pixels[i+1] = 255;
      pixels[i+2] = 255;
    } else {
      pixels[i] = 0;
      pixels[i+1] = 0;
      pixels[i+2] = 0;
    }
  }
  updatePixels();
  
}