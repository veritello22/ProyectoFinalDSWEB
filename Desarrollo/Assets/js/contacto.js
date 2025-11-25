let formulario = document.getElementById("contactForm")
let inputNombre = document.getElementById("contactName")
let inputEmail = document.getElementById("contactEmail")
let inputMensaje = document.getElementById("contactMessage")
let mensajeFormulario = document.getElementById("formAlert")
//Validamos que los input tengan contenido

formulario.addEventListener("submit", function(event){
    if(inputNombre.value.trim() === "" || inputEmail.value.trim() === "" || inputMensaje.value.trim() === ""){
        event.preventDefault()
        mensajeFormulario.innerText = "Por favor complete todos los campos"
        mensajeFormulario.style.display = "block"
        mensajeFormulario.style.color = "red"
        mensajeFormulario.style.textAlign = "center"
    }
    else if(inputNombre.value.length < 3){
        event.preventDefault()
        mensajeFormulario.innerText = "Por favor complete un nombre valido"
        mensajeFormulario.style.display = "block"
        mensajeFormulario.style.color = "red"
        mensajeFormulario.style.textAlign = "center"
    }
    else if(inputEmail.value.length < 3 || !inputEmail.value.includes("@")){
        event.preventDefault()
        mensajeFormulario.innerText = "Por favor complete un email valido"
        mensajeFormulario.style.display = "block"
        mensajeFormulario.style.color = "red"
        mensajeFormulario.style.textAlign = "center"
    }
    else if(inputMensaje.value.length < 15){
        event.preventDefault()
        mensajeFormulario.innerText = "Por favor complete un mensaje válido"
        mensajeFormulario.style.display = "block"
        mensajeFormulario.style.color = "red"
        mensajeFormulario.style.textAlign = "center"
    }
})

//Validamos que el input de mail tenga un formato valido


