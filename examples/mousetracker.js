function mm(){
              document.addEventListener('mousemove', mouseMoved);
}
      function mouseMoved(e){
          console.log('mouse has moved', e);
          document.getElementById("mousetracker").style.left=e.clientX+'px';
          document.getElementById("mousetracker").style.top=e.clientY+'px';
      }
