/** Aplicación Cordova de acceso a servidor e interacción con BD
 * @file index.js
 * @author Ignacio Javier Martínez Sánchez
 */

/** Cuando el dispositivo está listo, activa la función onDeviceReady 
 * @function
 */
document.addEventListener('deviceready', onDeviceReady, false);

/** Nuestras constantes son elementos del body del html, que no cambiarán */
/** Botón para volver al menú 
 * @constant
 */
const titulo = document.getElementById('btn_menu');
/** Formulario de login 
 * @constant
 */
const login = document.getElementById('formLogin');
/** Formulario de sign in 
 * @constant
 */
const signin = document.getElementById('formSignin');

/** Nuestras variables son aquellas que deben poder cambiar y asignarse */
/** Nombre del usuario */
let usuario;
/** Puntuación */
let puntos;
/** logros */
let logros = [];
/** Máxima puntuación registrada en la BD */
let highsc;

/** Función por defecto en la app Apache Cordova, muestra la plataforma y versión
 * @function onDeviceReady
 */
function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

/** Asocia la vuelta al menú al botón correspondiente 
 * @method
 */
titulo.addEventListener("click", function() {
  document.getElementById('aplicacion').src='http://80.30.41.125/';
});

/** Función de login
 * @function
 * @async
 */
login.addEventListener('submit', async (event) => {
    event.preventDefault();

    /** En este scoop sí nos interesa que estas variables sean constantes */
    /** Nombre de usuario ingresado */
    const nombre = login.floatingInputLog.value;
    /** Contraseña ingresada */
    const psw = login.floatingPasswordLog.value;
    /** Contraseña hasheada */
    const passhash = md5(psw);

    /** Petición que comprueba si existe el usuario y que sea la contraseña correcta
     * @method
     */
    const respuesta = await fetch(`http://80.30.41.125/api/user?nickname=${nombre}&pwd=${passhash}`, {
        method: 'GET'
    });

    if (respuesta.ok) {
        /** Aquí guardamos el nombre de usuario */
        /** Cuerpo de la respuesta */
        const user = await respuesta.json();
        /** Campo del nombre */
        usuario = user.nickname;
        
        /** Con el login correctamente hecho, mostramos y ocultamos los elementos correspondientes */
        document.getElementById('deviceready').classList.add('ready');
        $('#modalIniciarSesion').modal('hide');
        $('#menuBienvenida').removeClass("d-flex");
        $('#btn_menu').show();
        $('#icono_navbar').show();
        $('#btnLogin').hide();
        $('#btnSignIn').hide();

        /** Cargamos la URL del servidor en el iframe */
        document.getElementById('aplicacion').src='http://80.30.41.125/';
    } else {
        /** Manejamos el error, si se da, y mostramos un mensaje */
        const error = await respuesta.json();
        console.error(error.mensaje);
        $('#modalIniciarSesion').modal('hide');
        $('#alertas').html('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert"></button>Error durante login.</div>');
    }
});

/** Función de sign in
 * @function
 * @async
 */
signin.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    /** Volvemos a tomar nombre de usuario del formulario */
    const nombre = signin.floatingInputCrear.value;

    /** Primero comprobamos si hay un usuario con ese nick
     * @method
     */
    let comprobacion = await fetch(`http://80.30.41.125/api/user?nickname=${nombre}`);
  
    /** Un ok implica que sí existe un usuario con ese nick y por tanto el sign in falla */
    if (comprobacion.ok) {
      $('#modalCreaUsuario').modal('hide');
      $('#alertas').html('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert"></button>El usuario ya existe. Prueba otro nick.</div>');
    } else {
      /** Solo tras comprobar que no existe creamos el usuario tomando la contraseña*/
      /** Contraseña tal cual */
      const psw = signin.floatingPasswordCrear.value;
      /** Contraseña hasheada */
      const passhash = md5(psw);
      
      /** Definimos una función para el guardado de usuario y un login en caso de correcta creación
       * @function guardarUsuario
       * @param {Object} status
       * @return {Promise<string>}
       * @return {Error}
       */
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
  
      /** Hacemos post a la dirección de la API para la creación de usuario y llamamos a guardarUSuario si está ok
       * @function
       */
      $.post(
        'http://80.30.41.125/api/user',
        {
          nickname: nombre,
          pwd: passhash
        },
        function (data, status) {
          guardarUsuario(status)
            .then(() => {
              /** En caso de sign in correcto, seguimos el mismo comportamiento del login */
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
              /** En caso de error, lo notificamos */
              console.error(error);
              $('#modalCreaUsuario').modal('hide');
              $('#alertas').html('<div class="alert alert-danger alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert"></button>Error durante el login.</div>');
          });
        }
      );
    }
  });

/** Función de obtención de hi-score del usuario en un juego. Esto lo usamos para luego comprobar si hemos
 * establecido un récord
 * @function getHighsc
 * @param {String} game
 * @param {String} user
 * @return {Promise<string>}
 */
function getHighsc(game, user) {
  return new Promise((resolve, reject) => {
    fetch(`http://80.30.41.125/api/scoreboard?user=${user}&game=${game}&top=highsc`, { method: 'GET' })
      .then((response) => response.json())
      .then((response) => {
        highsc = response.score;
        resolve(highsc);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

/** Evento que captura el envío de datos desde el iframe, usado por los juegos para comunicarse con el body
 * Es aquí donde registramos los datos si hace falta. Aquí llamamos a getHighsc
 * @function
 * @param event
 */
$(window).on('message', function(event) {
  var datoRecibido = event.originalEvent.data;
  console.log('Simulación de envío de puntuación:', datoRecibido);

  getHighsc(datoRecibido.game,usuario)
    .then((highsc) => {
      console.log(highsc);  
    })
    .catch((error) => {
      console.error(error);
    });

  if(datoRecibido.score > highsc){
  $.post('http://80.30.41.125/api/scoreboard',
    {
      user: usuario,
      game: datoRecibido.game,
      score: datoRecibido.score,
      action: 'update'
    }),
    function(data, status){
      alert("Has establecido un nuevo record de: "+datoRecibido.score+" en el juego "+datoRecibido.game);
    };  
  }
    
});