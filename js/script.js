

const carrito = [];

// Constantes

const contenedor = document.querySelector("#contenedor");
const carritoContenedor = document.querySelector("#carritoContenedor");
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector("#precioTotal");
const activarFuncion = document.querySelector("#activarFuncion");
const procesarCompra = document.querySelector("#procesarCompra");
const totalProceso = document.querySelector("#totalProceso");
const formulario = document.querySelector('#procesar-pago')


//carga los cursos en .contenedor
stockCursos.forEach((curso) => {
    const { id, nombre, precio, desc, img, cantidad } = curso;
    if (contenedor) {
        contenedor.innerHTML += `
    <div class="card mt-3 tarjeta" style="width: 18rem;">
    <img class="card-img-top mt-2" src="${img}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text">Precio: ${precio}</p>
      <p class="card-text">Descripcion: ${desc}</p>
      <p class="card-text">Cantidad: ${cantidad}</p>
      <button class="btn btn-primary" onclick="agregarProducto(${id})">Comprar Curso</button>
    </div>
  </div>
    `;
    }
});

// Agraga los elementos clikeados al carrito 

const agregarProducto = (id) => {
    const existeCurso = carrito.some(curso => curso.id === id)

    if (existeCurso) {
        const prod = carrito.map(curso => {
            if (curso.id === id) {
                curso.cantidad++
            }
        })
    } else {
        const prod = stockCursos.find((curso) => curso.id === id)
        carrito.push(prod)
    }
    mostrarCarrito()
};


const mostrarCarrito = () => {
    const modalBody = document.querySelector(".modal .modal-body");
    if (modalBody) {
        modalBody.innerHTML = "";
        carrito.forEach((prod) => {
            const { id, nombre, precio, desc, img, cantidad } = prod;
            console.log(modalBody);
            modalBody.innerHTML += `
      <div class="modal-contenedor">
        <div>
        <img class="img-fluid img-carrito" src="${img}"/>
        </div>
        <div>
        <p>Producto: ${nombre}</p>
      <p>Precio: ${precio}</p>
      <p>Cantidad :${cantidad}</p>
      <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
        </div>
      </div>
      
  
      `;
        });
    }

    if (carrito.length === 0) {
        modalBody.innerHTML = `
    <p class="text-center text-primary parrafo">¡Aun no agregaste nada!</p>
    `;
    } else {
        
    }

    carritoContenedor.textContent = carrito.length;

    if (precioTotal) {
        precioTotal.innerText = carrito.reduce(
            (acc, prod) => acc + prod.cantidad * prod.precio,
            0
        );
    }

    guardarStorage();
};

function guardarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


if (activarFuncion) {
    activarFuncion.addEventListener("click", procesarPedido);
}

document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    mostrarCarrito();
    document.querySelector("#activarFuncion").click(procesarPedido);
});
if (formulario) {
    formulario.addEventListener('submit', enviarCompra)
}


if (vaciarCarrito) {
    vaciarCarrito.addEventListener("click", () => {
        carrito.length = [];
        mostrarCarrito();
    });
}

if (procesarCompra) {
    procesarCompra.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: "¡Tu carrito está vacio!",
                text: "Compra algo para continuar con la compra",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        } else {
            location.href = "compra.html";
        }
    });
}




function eliminarProducto(id) {
    const juegoId = id;
    carrito = carrito.filter((juego) => juego.id !== juegoId);
    mostrarCarrito();
}
function procesarPedido() {
    carrito.forEach((prod) => {
        const listaCompra = document.querySelector("#lista-compra tbody");
        const { id, nombre, precio, img, cantidad } = prod;
        if (listaCompra) {
            const row = document.createElement("tr");
            row.innerHTML += `
              <td>
              <img class="img-fluid img-carrito" src="${img}"/>
              </td>
              <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>${precio * cantidad}</td>
            `;
            listaCompra.appendChild(row);
        }
    });
    totalProceso.innerText = carrito.reduce(
        (acc, prod) => acc + prod.cantidad * prod.precio,
        0
    );
}

function enviarCompra(e) {
    e.preventDefault()
    const cliente = document.querySelector('#cliente').value
    const email = document.querySelector('#correo').value

    if (email === '' || cliente == '') {
        Swal.fire({
            title: "¡Debes completar tu email y nombre!",
            text: "Rellena el formulario",
            icon: "error",
            confirmButtonText: "Aceptar",
        })
    } else {

        const btn = document.getElementById('button');

        // document.getElementById('procesar-pago')
        //  .addEventListener('submit', function(event) {
        //    event.preventDefault();

        btn.value = 'Enviando...';

        const serviceID = 'default_service';
        const templateID = 'template_qxwi0jn';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Finalizar compra';
                alert('Correo enviado!');
            }, (err) => {
                btn.value = 'Finalizar compra';
                alert(JSON.stringify(err));
            });

        const spinner = document.querySelector('#spinner')
        spinner.classList.add('d-flex')
        spinner.classList.remove('d-none')

        setTimeout(() => {
            spinner.classList.remove('d-flex')
            spinner.classList.add('d-none')
            formulario.reset()

            const alertExito = document.createElement('p')
            alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
            alertExito.textContent = 'Compra realizada correctamente'
            formulario.appendChild(alertExito)

            setTimeout(() => {
                alertExito.remove()
            }, 3000)


        }, 3000)
    }
    localStorage.clear()

}