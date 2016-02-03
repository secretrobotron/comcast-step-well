(function () {

  function start (e) {
    var audioElements = document.querySelectorAll('audio');
    var imageElements = document.querySelectorAll('img');
    var imageContainer = document.querySelector('img').parentNode;

    imageElements = Array.prototype.slice.call(imageElements);

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

    imageElements = imageElements.map(function (imageElement) {
      var div = document.createElement('div');
      div.classList.add('image');
      div.style.backgroundImage = 'url(\'' + imageElement.src + '\')';
      return div;
    });

    console.log(imageElements);

    var imageIndex = 0;
    var shownImages = [];
    function showNextImage() {
      var nextImage = imageElements[imageIndex];
      var imageToShow = imageElements[imageIndex];
      var imageToPrepare = imageElements[(imageIndex + 1) % imageElements.length];

      imageIndex = (imageIndex + 1) % imageElements.length;

      imageToPrepare.classList.add('ready');
      imageToPrepare.classList.remove('show');

      imageContainer.appendChild(imageToPrepare);
      imageToShow.classList.add('show');

      // Try to compensate for Chrome not updating gfx properly.
      var imageStackSize = 6;

      for (var i = imageStackSize - 1; i > 0; --i) {
        shownImages[i] = shownImages[i-1];
      }

      shownImages[0] = imageToPrepare;

      if (shownImages[imageStackSize - 1]) {
        shownImages[imageStackSize - 1].classList.remove('show');
        shownImages[imageStackSize - 1].classList.remove('ready');
        imageContainer.removeChild(shownImages[imageStackSize - 1]);
      }

      setTimeout(showNextImage, 800);
    }

    showNextImage();
    playNextAudio();
  }

  document.onreadystatechange = function (e) {
    if (document.readyState === 'complete') {
      start();
    }
  };

})();