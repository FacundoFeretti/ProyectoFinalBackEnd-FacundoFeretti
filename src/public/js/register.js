const form = document.getElementById('registerForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    //Crea un objeto con todos los datos puestos en el formulario.
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    //Hace peticion tipo POST del objeto con los id de los input
    //como los keys y los valores ingresados en el formulario como value
    fetch('/api/sessions/register',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Verificar la respuesta JSON del servidor
        if (data.status === 'success') {
            // Redireccionar al usuario a la página de inicio de sesión
            window.location.href = '/';
        }
    });
});