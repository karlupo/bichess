const editBtn = document.getElementById('edit');
const editProfile = document.getElementById('editProfile');

editBtn.addEventListener('click', () => {
    editProfile.classList.toggle('hidden');
    document.getElementById('maininfos').classList.toggle('blur');
});

const form = document.getElementById('editForm');

let imageUrl = "";
form.addEventListener('submit', (event) => {

    // Verhindern des Standardverhaltens des Formulars (Seite neu laden)
    event.preventDefault();
    console.log("Hello")
    // Extrahieren der Formulardaten
    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    console.log(formObject);
    if (imageUrl == "") {
        
        formObject['imgUpload'] = "";
        updateDatabase(formObject);
    } else {
        const image = new Image();
        image.src = imageUrl;
        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);


            var compressedDataURL = canvas.toDataURL('image/jpeg', 0.15);
            formObject['imgUpload'] = compressedDataURL;

            updateDatabase(formObject);

        };
    }


});

function updateDatabase(formObject) {
    console.log(formObject);
    imageUrl = "";
    // Senden der Post-Anfrage
    fetch('/updateprofile', {
        method: 'POST',
        body: JSON.stringify(formObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else if (response.headers.get('Content-Type') === 'application/json; charset=utf-8') {
                console.log("Hello")
                return response.json();
            } else if (response.status === 413) {
                showNotification("Error", "Das Bild ist zu groß")
            } else {
                return {};
            }
        })
        .then(data => {
            if (data != undefined) {
                if (Object.keys(data).length != 0) {
                    showNotification("Error", data.message);
                }
            }
        })
        .catch(error => {
            window.location.href = "/";
            showNotification("Error", "Ein Fehler ist aufgetreten");
        });
}


const closeBtn = document.getElementById('closeEdit');
closeBtn.addEventListener('click', () => {
    editProfile.classList.toggle('hidden');
    document.getElementById('maininfos').classList.toggle('blur');
});

const inputElement = document.getElementById('imgUpload');
const editImage = document.getElementById('editImage');

inputElement.addEventListener('change', function () {
    const file = inputElement.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            imageUrl = event.target.result;
            console.log(imageUrl);
            editImage.style.backgroundImage = 'url("' + imageUrl + '")';
        };

        reader.readAsDataURL(file);
    }
});

document.getElementById("profilepic").src = profilepic;
editImage.style.backgroundImage = 'url("' + profilepic + '")';