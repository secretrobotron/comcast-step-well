// By Bobby Richter and Laura de Reynal
// License: MIT & CC-NonCommercial

(function () {

  let startButton, startContainer;

  function getReady(e) {
    startContainer = document.querySelector('#start-container');
    startButton = document.querySelector('#start-button');
    startContainer.removeChild(startButton);
  }

  function ready(e) {
    let loadingBlock = document.querySelector('#loading');
    loadingBlock.classList.add('hide');

    setTimeout(e => {
      startContainer.removeChild(loadingBlock);
      startContainer.appendChild(startButton);
      setTimeout(e => {
        startButton.classList.add('show');
      }, 100)
    }, 1000);

    startButton.addEventListener('click', function onStartButtonClick(e) {
      startButton.removeEventListener('click', onStartButtonClick);
      startButton.classList.remove('show');
      setTimeout(e => {
        startContainer.parentNode.removeChild(startContainer);
        start();
      }, 2000);
    });
  }

  function start(e) {
    var audioElements = document.querySelectorAll('audio');
    var imageElements = document.querySelectorAll('img');
    var imageContainer = document.querySelector('img').parentNode;

    imageElements = Array.prototype.slice.call(imageElements);

    document.querySelector('#title').classList.add('show');
    document.querySelector('#subtitle').classList.add('show');

    function playNextAudio() {
      // Pick a random audio element, and clone it for playing.
      var nextAudio = audioElements[Math.floor(Math.random() * audioElements.length)];
      nextAudio = nextAudio.cloneNode(true);

      // Wait for current audio to be 90% done, and start another.
      function onTimeUpdate(e) {
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
    if (document.readyState === 'interactive') {
      getReady();
    }
    else if (document.readyState === 'complete') {
      ready();
    }
  };

})();