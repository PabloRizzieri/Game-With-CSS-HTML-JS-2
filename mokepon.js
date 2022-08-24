const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById("btn-mascotas")
sectionReiniciar.style.display = 'none'
const botonReiniciar = document.getElementById('btn-reiniciar')
const sectionSeleccionarAtaque = document.getElementById('select-ataque')



const sectionSeleccionarMascota = document.getElementById('select-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')
const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')
const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')


let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let input1 
let input2 
let input3 
let mascotaJugador
let mascotaDeJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego 
let botonAgua 
let botonTierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let intervalo 
let mapaBackground = new Image()
mapaBackground.src = './img/mokemap.png'

let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 50

const anchoMaximoDelMapa = 750
if(anchoDelMapa > anchoMaximoDelMapa){
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos



let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext('2d')





class Mokepon{
    constructor(nombre, foto, vida, fotoMapa, x = 10, y = 10, id = null){
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 60
        this.alto = 60
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMokepon(){
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.alto,
            this.ancho
        )
    }
}

let hipodoge = new Mokepon('HIPODOGE', './img/hipodoge.png', 5, './img/hipodogeMapa.png')
let capipepo = new Mokepon('CAPIPEPO', './img/capipepo.png', 5, './img/capipepoMapa.png')
let ratigueya = new Mokepon('RATIGUEYA', './img/rata.png', 5, './img/mapaRata.png')

const HIPODOGE_ATAQUES = [{nombre: '💧', id: 'btn-agua'},
{nombre: '💧', id: 'btn-agua'},
{nombre: '💧', id: 'btn-agua'},
{nombre: '🔥', id: 'btn-fuego'},
{nombre: '🌱', id: 'btn-tierra'},]

const CAPIPEPO_ATAQUES = [{nombre: '🌱', id: 'btn-tierra'},
{nombre: '🌱', id: 'btn-tierra'},
{nombre: '🌱', id: 'btn-tierra'},
{nombre: '🔥', id: 'btn-fuego'},
{nombre: '💧', id: 'btn-agua'},]

const RATIGUEYA_ATAQUES = [{nombre: '🔥', id: 'btn-fuego'},
{nombre: '🔥', id: 'btn-fuego'},
{nombre: '🔥', id: 'btn-fuego'},
{nombre: '💧', id: 'btn-agua'},
{nombre: '🌱', id: 'btn-tierra'},]

hipodoge.ataques.push(...HIPODOGE_ATAQUES)

ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

capipepo.ataques.push(...CAPIPEPO_ATAQUES)

mokepones.push(hipodoge,capipepo,ratigueya)

function iniciarJuego(){
    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'
    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `
    contenedorTarjetas.innerHTML += opcionDeMokepones
    
    input1 = document.getElementById('HIPODOGE')
    input2 = document.getElementById('RATIGUEYA')
    input3 = document.getElementById('CAPIPEPO')
    })
    
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener ('click', reiniciarJuego)
    unirseAlJuego()

}

function unirseAlJuego(){
    fetch("http://localhost:8080/unirse")
        .then(function (res){
            if(res.ok){
                res.text()
                    .then(function (respuesta){
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}




function seleccionarMascotaJugador(){
    if(input1.checked){
        spanMascotaJugador.innerHTML = input1.id
        mascotaJugador = input1.id
    } else if(input2.checked){
        spanMascotaJugador.innerHTML = input2.id
        mascotaJugador = input2.id
    } else if (input3.checked){
        spanMascotaJugador.innerHTML = input3.id
        mascotaJugador = input3.id
    } else{
        alert('NO SELECCIONASTE NADA, POR FAVOR SELECCIONA UNA')
        return
    }

    sectionSeleccionarMascota.style.display = 'none'

    seleccionarMokepon(mascotaJugador)

    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador){
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador){
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if(mascotaJugador === mokepones[i].nombre){
            ataques = mokepones[i].ataques
        }
        
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        ataquesMokepon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })
    botonFuego = document.getElementById('btn-fuego')
    botonAgua = document.getElementById('btn-agua')
    botonTierra = document.getElementById('btn-tierra')
    botones = document.querySelectorAll('.BAtaque')

}

function secuenciaAtaque(){
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) =>{
            if(e.target.textContent === '🔥'){
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#2a7a0bad'
                boton.disabled = true
            } else if(e.target.textContent === '💧'){
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#2a7a0bad'
                boton.disabled = true
            }else{
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = '#2a7a0bad'
                boton.disabled = true
            }
            if(ataqueJugador.length = 5){
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques(){
    fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques(){
    fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5){
                            ataqueEnemigo = ataques
                            resultadoBatalla()
                        }
                    })
            }
        })
}

function seleccionarMascotaEnemigo(enemigo){
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    secuenciaAtaque()
}

function ataqueAleatorioEnemigo(){
    console.log('ataques ENEMIGO', ataquesMokeponEnemigo);
    let ataqueAleatorioEnemigo = aleatorio(0, ataquesMokeponEnemigo.length -1)
    if(ataqueAleatorioEnemigo == 0 || ataqueAleatorioEnemigo == 1){
        ataqueEnemigo.push("FUEGO") 
    } else if(ataqueAleatorioEnemigo == 3 || ataqueAleatorioEnemigo == 4){
        ataqueEnemigo.push("AGUA")
    } else{
        ataqueEnemigo.push("TIERRA")
    }
    iniciarPelea()
}

function iniciarPelea(){
    if (ataqueJugador.length === 5) {
        resultadoBatalla()
    }
}

function indexAmbosOponentes(jugador, enemigo){
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function resultadoBatalla(){
    clearInterval(intervalo)

    for (let i = 0; i < ataqueJugador.length; i++) {
        if(ataqueJugador[i] === ataqueEnemigo[i]){
            indexAmbosOponentes(i, i)
            crearMensaje('EMPATE')
        }else if(ataqueJugador[i] === 'FUEGO' && ataqueEnemigo[i] === 'TIERRA'){
            indexAmbosOponentes(i, i)
            crearMensaje('GANASTE')
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        }else if(ataqueJugador[i] === 'TIERRA' && ataqueEnemigo[i] === 'AGUA'){
            indexAmbosOponentes(i, i)
            crearMensaje('GANASTE')
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        }else if(ataqueJugador[i] === 'AGUA' && ataqueEnemigo[i] === 'FUEGO'){
            indexAmbosOponentes(i, i)
            crearMensaje('GANASTE')
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        }else{
            indexAmbosOponentes(i, i)
            crearMensaje('PERDISTE')
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }
    revisarVidas()
}

function revisarVidas(){
    if(victoriasJugador === victoriasEnemigo){
        crearMensajeFinal("EMPATE?")
    } else if(victoriasJugador > victoriasEnemigo){
        crearMensajeFinal("GANASTE UWU")
    }else{
        crearMensajeFinal("PERDISTE UNU")
    }
}




function crearMensaje(resultado){

    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
} 

function crearMensajeFinal(resultadoFinal){

    sectionMensajes.innerHTML = resultadoFinal
    sectionReiniciar.style.display = 'block'
}  


function reiniciarJuego(){
    location.reload()
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas(){
    mascotaDeJugadorObjeto.x = mascotaDeJugadorObjeto.x + mascotaDeJugadorObjeto.velocidadX
    mascotaDeJugadorObjeto.y = mascotaDeJugadorObjeto.y + mascotaDeJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaDeJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaDeJugadorObjeto.x, mascotaDeJugadorObjeto.y)

    mokeponesEnemigos.forEach(function(mokepon){
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function enviarPosicion(x, y){
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function ({enemigos}) {
                    console.log(enemigos)
                    mokeponesEnemigos = enemigos.map(function (enemigo) {
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""
                        if(mokeponNombre === "HIPODOGE") {
                            mokeponEnemigo = new Mokepon('HIPODOGE', './img/hipodoge.png', 5, './img/hipodogeMapa.png', enemigo.id)
                        } else if(mokeponNombre === "CAPIPEPO") {
                            mokeponEnemigo = new Mokepon('CAPIPEPO', './img/capipepo.png', 5, './img/capipepoMapa.png', enemigo.id)
                        } else if(mokeponNombre === "RATIGUEYA") {
                            mokeponEnemigo = new Mokepon('RATIGUEYA', './img/rata.png', 5, './img/mapaRata.png', enemigo.id)
                        }
                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y

                        return mokeponEnemigo
                    })
                })
        }       
    })

}

function moverDerecha(){
    mascotaDeJugadorObjeto.velocidadX = 5
}
function moverIzquierda(){
    mascotaDeJugadorObjeto.velocidadX = -5
}
function moverAbajo(){
    mascotaDeJugadorObjeto.velocidadY = 5
}
function moverArriba(){
    mascotaDeJugadorObjeto.velocidadY = -5
}

function detenerMovimiento(){
    mascotaDeJugadorObjeto.velocidadX = 0
    mascotaDeJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event){
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break    
        default:
            break
    }
}

function iniciarMapa(){
    mascotaDeJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)
    window.addEventListener('keydown', sePresionoUnaTecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoMascota(){
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre){
            return mokepones[i]
        }
        
    }
}

function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaDeJugadorObjeto.y
    const abajoMascota = mascotaDeJugadorObjeto.y + mascotaDeJugadorObjeto.alto
    const derechaMascota = mascotaDeJugadorObjeto.x + mascotaDeJugadorObjeto.ancho
    const izquierdaMascota = mascotaDeJugadorObjeto.x

    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
}


window.addEventListener('load', iniciarJuego)

const musica = document.getElementById('musica')
document.addEventListener('keydown', function (evento) {
    if(evento.keyCode == 32){
        if(!musica) return;
        musica.currentTime = 0;
        musica.play();
    } else if(evento.keyCode == 80){
        musica.pause()
    }
})




