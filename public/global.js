const navicon = document.getElementById('navicon');
const navlinks = document.getElementById('navlinks');
const title = document.getElementById('title');

navicon.addEventListener('click', () => {
  navicon.classList.toggle('fa-times');
  navlinks.classList.toggle('toogleBar');
  title.classList.toggle('toogleBar');
});


window.addEventListener('load', function () {
  fadeInCheck();
});

window.addEventListener('scroll', function () {
  fadeInCheck();
});

function fadeInCheck() {
  var elements = document.getElementsByClassName('fade-in');
  for (var i = 0; i < elements.length; i++) {
    var position = elements[i].offsetTop;
    var scroll = window.scrollY || window.pageYOffset;
    var windowHeight = window.innerHeight;
    if (scroll > position - windowHeight + 150) {
      elements[i].classList.add('fade-in-show');
    } else {
      elements[i].classList.remove('fade-in-show');
    }
  }
}

document.getElementById('title').addEventListener('click', () => {
  window.location = '/';
});


function showNotification(title, message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
  let children = document.body.children;
  for (let i = 0; i < children.length; i++) {
    if (children[i].classList.contains('notification')) {
      children[i].remove();
    }
  }
  document.body.appendChild(notification);

  // Fade out and remove notification after 6 seconds
  setTimeout(() => {
    notification.style.animation = "fadeout 0.5s forwards";
    setTimeout(() => {
      notification.remove();
    }, 500); // wait for fadeout animation to finish
  }, 6000);
}

//FEN Format z.B. rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
function decodeFEN(fenString) {
  let pieces = [];
  let row = 1;
  let column = 1;
  for (let i = 0; i < fenString.length; i++) {
    if (fenString.charAt(i) == '/') {
      column++;
      row = 1;
    } else if (!isNaN((Number)(fenString.charAt(i)))) {
      row += (Number)(fenString.charAt(i));
    } else {
      let color;
      if (fenString.charAt(i).toUpperCase() == fenString.charAt(i)) {
        color = "White";
      } else {
        color = "Black";
      }

      if (fenString.charAt(i).toUpperCase() == 'R') {
        pieces.push(new Rook(((String)(row) + (String)(column)), color));
      } else if (fenString.charAt(i).toUpperCase() == 'N') {
        pieces.push(new Knight(((String)(row) + (String)(column)), color));
      } else if (fenString.charAt(i).toUpperCase() == 'B') {
        pieces.push(new Bishop(((String)(row) + (String)(column)), color));
      } else if (fenString.charAt(i).toUpperCase() == 'Q') {
        pieces.push(new Queen(((String)(row) + (String)(column)), color));
      } else if (fenString.charAt(i).toUpperCase() == 'K') {
        pieces.push(new King(((String)(row) + (String)(column)), color));
      } else if (fenString.charAt(i).toUpperCase() == 'P') {
        pieces.push(new Pawn(((String)(row) + (String)(column)), color));
      }
      row++;
    }
  }
  return pieces;
}

