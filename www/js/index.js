document.addEventListener('deviceready', onDeviceReady, false);

const titulo = document.getElementById('btn_menu');
const login = document.getElementById('formLogin');
const signin = document.getElementById('formSignin');
let usuario;
let puntos;
let logro;

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

titulo.addEventListener("click", function() {
  document.getElementById('aplicacion').src='http://80.30.41.125/';
});

login.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    const nombre = login.floatingInputLog.value;
    const psw = login.floatingPasswordLog.value;
    const passhash = md5(psw);

    // Enviar la solicitud a la API
    const respuesta = await fetch(`http://80.30.41.125/api/user?nickname=${nombre}&pwd=${passhash}`, {
        method: 'GET'
    });

    // Manejar la respuesta de la API
    if (respuesta.ok) {
        const user = await respuesta.json();
        // Inicio de sesión exitoso, hacer algo con la información del usuario
        usuario = user.nickname;
        
        document.getElementById('deviceready').classList.add('ready');
        $('#modalIniciarSesion').modal('hide');
        $('#menuBienvenida').removeClass("d-flex");
        $('#btn_menu').show();
        $('#icono_navbar').show();
        $('#btnLogin').hide();
        $('#btnSignIn').hide();

        document.getElementById('aplicacion').src='http://80.30.41.125/';
    } else {
        // Inicio de sesión fallido, mostrar un mensaje de error
        const error = await respuesta.json();
        console.error(error.mensaje);
        $('#modalIniciarSesion').modal('hide');
        $('#alertas').html('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert"></button>Error durante login.</div>');
    }
});

signin.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const nombre = signin.floatingInputCrear.value;
    let comprobacion = await fetch(`http://80.30.41.125/api/user?nickname=${nombre}`);
  
    if (comprobacion.ok) {
      $('#modalCreaUsuario').modal('hide');
      $('#alertas').html('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert"></button>El usuario ya existe. Prueba otro nick.</div>');
    } else {
      const psw = signin.floatingPasswordCrear.value;
      const passhash = md5(psw);
  
      function guardarUsuario(status) {
        return new Promise((resolve, reject) => {
          if (status === 'success') {
            fetch(`http://80.30.41.125/api/user?nickname=${nombre}&pwd=${passhash}`, { method: 'GET' })
              .then((respuesta2) => {
                if (respuesta2.ok) {
                  return respuesta2.json();
                } else {
                  throw new Error('Error durante el login.');
                }
              })
              .then((user) => {
                // Asignar el valor a la variable global
                usuario = user.nickname;
                resolve();
              })
              .catch((error) => {
                console.error(error);
                reject(error);
              });
          } else {
            reject(new Error('Error durante el login.'));
          }
        });
      }
  
      $.post(
        'http://80.30.41.125/api/user',
        {
          nickname: nombre,
          pwd: passhash
        },
        function (data, status) {
          guardarUsuario(status)
            .then(() => {
              // Continuar con otras operaciones que dependan de "usuario"
              document.getElementById('deviceready').classList.add('ready');
              $('#modalCreaUsuario').modal('hide');
              $('#menuBienvenida').removeClass('d-flex');
              $('#btn_menu').show();
              $('#icono_navbar').show();
              $('#btnLogin').hide();
              $('#btnSignIn').hide();
              document.getElementById('aplicacion').src = 'http://80.30.41.125/';
            })
            .catch((error) => {
              console.error(error);
              $('#modalCreaUsuario').modal('hide');
              $('#alertas').html('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert"></button>Error durante el login.</div>');
            });
        }
      );
    }
  });

$(window).on('message', function(event) {
  //TODO: recibir puntuacion al empezar, para poder comparar si se guarda o no
  var datoRecibido = event.originalEvent.data;
  ///api/scoreboard?user={user_nickname}&game={game_name}&score={score}
  console.log('Simulación de envío de puntuación:', datoRecibido);
  if(datoRecibido.tipo=="score"){
    $.post('http://80.30.41.125/api/scoreboard',
    {
      user: nombre,
      game: datoRecibido.juego,
      score: datoRecibido.dato
    });
  }else if(datoRecibido.tipo=="achievement"){     
    $.post('http://80.30.41.125/api/scoreboard',
    {
      user: nombre,
      game: datoRecibido.juego,
      score: datoRecibido.dato
    });
  }
    
});

//TODO: Jquery (?)