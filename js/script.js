
let carrito = [];

const contenedor = document.querySelector("#contenedor");
const carritoContenedor = document.querySelector("#carritoContenedor");
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector("#precioTotal");
const continuarCompra = document.querySelector("#continuarCompra");
const activarFuncion = document.querySelector("#activarFuncion");
const totalProceso = document.querySelector("#totalProceso");
const formulario = document.querySelector('#procesar-pago')



document.addEventListener("DOMContentLoaded", () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  mostrarCarrito();
  document.querySelector("#activarFuncion").click(procesarPedidoCursos);
})


if (activarFuncion) {
  activarFuncion.addEventListener("click", procesarPedidoCursos);
}



function procesarPedidoCursos() {
  carrito.forEach((curso) => {
    const listaCompra = document.querySelector("#lista-compra tbody");
    const { id, nombre, precio, img, cantidad } = curso;
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

if (continuarCompra) {
  continuarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "¡Tu carrito está vacio!",
        text: "Debes comprar algo para poder  continuar con la compra",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      location.href = "compra.html";
      procesarPedidoCursos();
    }
  })
};



stockCursos.forEach((prod) => {
  const { id, nombre, precio, desc, img, cantidad } = prod;
  if (contenedor) {
    contenedor.innerHTML += `
    <div class="card mt-3" style="width: 18rem;">
    <img class="card-img-top mt-2" src="${img}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text">Precio: ${precio}</p>
      <p class="card-text">Descripcion: ${desc}</p>
      <p class="card-text">Cantidad: ${cantidad}</p>
      <button class="btn btn-primary" onclick="agregarCurso(${id})">Comprar Curso</button>
    </div>
  </div>
    `;
  }
});



const agregarCurso = (id) => {
  const existe = carrito.some(prod => prod.id === id)

  if (existe) {
    const prod = carrito.map(prod => {
      if (prod.id === id) {
        prod.cantidad++
      }
    })
  } else {
    const item = stockCursos.find((prod) => prod.id === id)
    carrito.push(item)
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
        <button class="btn btn-danger"onclick="eliminarCurso(${id})">Eliminar Curso</button>
          </div>
        </div>
        `;
    });
  }

  if (carrito.length === 0) {
    console.log("Nada");
    modalBody.innerHTML = `
      <p class="text-center text-primary parrafo">El carrito esta vacio</p>
      `;
  } else {

  }
  carritoContenedor.textContent = carrito.length;

  if (precioTotal) {
    precioTotal.innerText = carrito.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio, 0
    );
  }

  guardarStorage();
};



function eliminarCurso(id) {
  const cursoId = id;
  carrito = carrito.filter((curso) => curso.id !== cursoId);
  mostrarCarrito();
}


function guardarStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}



if (vaciarCarrito) {
  vaciarCarrito.addEventListener("click", () => {
    carrito.length = [];
    mostrarCarrito();
  });
}


if (formulario) {
  formulario.addEventListener('submit', enviarCompra)
}



function enviarCompra(e) {
  e.preventDefault()

  const cliente = document.querySelector('#cliente').value
  const email = document.querySelector('#correo').value

  console.log(cliente);

  if (email === '' || cliente == '') {
    Swal.fire({
      title: "¡Debes completar tu email y nombre!",
      text: "Rellena el formulario",
      icon: "error",
      confirmButtonText: "Aceptar",
    })
  } else {
   
    const spinner = document.querySelector('#spinner')
    spinner.classList.add('d-flex')
    spinner.classList.remove('d-none')

    setTimeout(() => {
      spinner.classList.remove('d-flex')
      spinner.classList.add('d-none')
      formulario.reset()
    }, 3000)

    const alertExito = document.createElement('p')
    alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
    alertExito.textContent = 'Compra realizada correctamente'
    formulario.appendChild(alertExito)

    setTimeout(() => {
      alertExito.remove()
    }, 3000)

   localStorage.clear()

  }
}
