let hp = "./assets/heart.gif";
var cards = [
    createCard("¡Hola!", hp, "¡He diseñado algo muy especial para ti!<br/>¡Haz 14 clicks más!", 1),
    createCard("¿Ya te acostumbras?", hp, "Como puedes ver, entre más clicks hagas, verás más mensajes", 15),
    createCard("¡Buenos días preciosa!", "./assets/yure1.jpg", "No tengo siquiera que verte para saber lo muy preciosa que luces esta mañana. Hice esto para ti con mucho amor <3<br/>Mi mensaje es que te aprecio demasiado y es muy lindo tenerte aquí un día más :)", 30),
    createCard("¡Falta 1 día!", hp, "Al día de hoy puedo confirmar que falta 1 día para cumplir 5 meses desde aquel día en el que nos convertimos novios. Prácticamente medio año ya que se ha sentido brutal, definitivamente superaste cualquier expectativa que podría tener, porque en ti encontré lo que me faltaba y eso me hace sentir demasiado alegre.", 45)
];

function createCard(title, picture, message, requiredClicks) {
    return {
        titulo: title,
        foto: picture,
        mensaje: message,
        clicks: requiredClicks
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const heartContainer = document.getElementById("heart-container");
    const heartElement = document.getElementById("heart");
    const gif = document.getElementById("hearts");
    const progressBar = document.getElementsByClassName("progress-bar")[0];
    
    var timeoutId;
    var currentCardIndex = -1;
    var clicks = 0;

    // Ambos escuchan al evento
    heartElement.addEventListener("click", onClickHeart);
    gif.addEventListener("click", onClickHeart);
    document.getElementById("delete-all").addEventListener("click", () => {
        clicks = 0;
        currentCardIndex = -1;
        localStorage.setItem("clicks", clicks);

        updateElements();
        alert("¡Progreso reiniciado!");
    });

    document.getElementById("btn-close-card").addEventListener("click", () => {
        const cardElement = document.getElementsByClassName("card")[0];
        
        hide(cardElement);
        show(heartContainer);
    })

    function hide(element) {
        element.classList.add("hidden-container");
    }

    function show(element) {
        element.classList.remove("hidden-container");
    }

    
    if (localStorage.getItem("clicks")) {
        // Cargar clicks y cartas obtenidas
        clicks = parseInt(localStorage.getItem("clicks"));
        while (nextCardReached()) currentCardIndex++;

        updateElements();
    }

    function onClickHeart() {
        
        // Eliminar timeout existente
        clearTimeout(timeoutId);

        gif.style.visibility = "visible";
        timeoutId = setTimeout(() => {
            gif.style.visibility = "collapse";
        }, 500);

        increaseClickCount();
        checkForRewards();
        updateElements();
    }
    
    function increaseClickCount() {
        const counter = document.getElementById("click-counter");

        let audio = new Audio('./assets/coin.mp3');
        audio.play();

        clicks++;
        localStorage.setItem("clicks", clicks);
    }

    function checkForRewards() {
        if (hasNext()) {
            let nextCard = cards[currentCardIndex + 1];

            if (clicks >= nextCard.clicks) {
                alert("¡Has alcanzado una nueva nota!");
                currentCardIndex++; // Actualizar para que sea la siguiente
                
                showCard();
                revealNextReward();
            }
        }
    }

    function showCard() {
        // Ocultar contenedor de corazón
        hide(heartContainer);

        const card = cards[currentCardIndex];

        const cardElement = document.getElementsByClassName("card")[0];
        const titleElement = document.getElementById("card-title");
        const textElement = document.getElementById("card-text");
        const imageElement = document.getElementById("card-image");
        console.log(JSON.stringify(card));

        titleElement.innerHTML = card.titulo;
        textElement.innerHTML = card.mensaje;
        imageElement.src = card.foto;
        show(cardElement);
    }

    function nextCardReached() {
        return hasNext() && clicks >= cards[currentCardIndex + 1].clicks;
    }

    function revealNextReward() {
        if (hasNext()) {
            let nextCard = cards[currentCardIndex + 1];
            alert("¡La siguiente nota se mostrará a los " + nextCard.clicks + " clicks!");
        } else {
            alert("¡Ya no hay más recompensas disponibles!")
        }
    }

    function updateElements() {
        const clickCount = document.getElementById("click-counter");
        const cardCount = document.getElementById("card-counter");

        cardCount.innerHTML = "Notas desbloqueadas: <b>" + getUnlockedCards() + "</b>";

        if (hasNext()) {
            let nextCard = cards[currentCardIndex + 1];

            let percent = clicks / nextCard.clicks * 100;
            progressBar.style.width = percent + "%";

            clickCount.innerHTML = "Clicks: <b>" + clicks + " / " + nextCard.clicks + "</b>";
        } else {
            clickCount.innerHTML = "Clicks: <b>" + clicks + "</b>";
        }
    }

    function hasNext() {
        return currentCardIndex < cards.length - 1;
    }

    function getUnlockedCards() {
        return currentCardIndex + 1;
    }
});