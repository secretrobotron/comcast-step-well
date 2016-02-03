(function () {

  document.addEventListener('DOMContentLoaded', function (e) {
    var audioElements = document.querySelectorAll('audio');
    var imageElements = document.querySelectorAll('.image');
    var imageContainer = document.querySelector('.image').parentNode;

    imageElements = Array.prototype.slice.call(imageElements);

    console.log(imageElements);

    function playNextAudio() {
      // Pick a random audio element, and clone it for playing.
      var nextAudio = audioElements[Math.floor(Math.random() * audioElements.length)];
      nextAudio = nextAudio.cloneNode(true);

      // Wait for current audio to be 90% done, and start another.
      function onTimeUpdate (e) {
        if (nextAudio.currentTime > nextAudio.duration * 0.9) {
          playNextAudio();
          nextAudio.removeEventListener('timeupdate', onTimeUpdate);
        }
      }

      // Fade in volume slowly (linear).
      nextAudio.volume = 0.1;
      var interval = setInterval(function () {
        nextAudio.volume = Math.min(nextAudio.volume + 0.01, 1);
        if (nextAudio >= 1) {
          clearInterval(interval);
        }
      }, 10);

      // Clean event listening.
      nextAudio.addEventListener('timeupdate', onTimeUpdate);
      nextAudio.addEventListener('ended', function onEnded (e) {
        nextAudio.removeEventListener('timeupdate', onTimeUpdate);
        nextAudio.removeEventListener('ended', onEnded);
      });

      // Ok, go!
      nextAudio.play();
    }

    imageElements.forEach(function (imageElement) {
      imageContainer.removeChild(imageElement);
    });

    var imageIndex = 0;
    var shownImages = [];
    function showNextImage() {
      var nextImage = imageElements[imageIndex];
      var imageToShow = imageElements[imageIndex];
      var imageToPrepare = imageElements[(imageIndex + 1) % imageElements.length];

      imageIndex = (imageIndex + 1) % imageElements.length;

      imageToPrepare.classList.add('ready');
      imageToPrepare.classList.remove('show');

      imageContainer.appendChild(imageToShow);
      setTimeout(function () {
        imageToShow.classList.add('show');
      }, 50);


      // Try to compensate for Chrome not updating gfx properly.
      shownImages[4] = shownImages[3];
      shownImages[3] = shownImages[2];
      shownImages[2] = shownImages[1];
      shownImages[1] = shownImages[0];
      shownImages[0] = imageToShow;

      if (shownImages[4]) {
        shownImages[4].classList.remove('show');
        shownImages[4].classList.remove('ready');
        imageContainer.removeChild(shownImages[4]);
      }

      setTimeout(showNextImage, 800);
    }

    showNextImage();
    playNextAudio();
  });

})();