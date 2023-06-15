const scrollDown = document.getElementById('scrolldowndiv');

window.addEventListener('scroll', function() {

    var scroll = window.scrollY || window.pageYOffset;
    if(scroll > 150 && scroll < 400){
        scrollDown.style.opacity = 0.5;
    }

    if(scroll > 400){
        scrollDown.style.opacity = 0;
    }
    if(scroll < 150){
        scrollDown.style.opacity = 1;
        scrollDown.classList.remove('alreadyScrolled')
    }
});
