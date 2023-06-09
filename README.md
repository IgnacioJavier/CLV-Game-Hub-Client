# CLV Game Hub (Client Side)

Esta es una aplicación híbrida que usa tecnología web para poder dar un servicio multiplataforma. Emplea el IDE **Apache Cordova** para generar correctamente las exportaciones a otras plataformas y poder acceder a su gama de plugins. Nuestra aplicación permite acceder a un servidor de juegos e interactuar con él.

## Instalación, funcionamiento y uso

Desde esta aplicación accedemos a nuestro servidor de juegos. Es también quien interactúa con nuestra base de datos para las peticiones, haciendo esta directamente las peticiones a la API. De esta manera, los juegos carecen de lógica de intercacción con la base de datos y dejan en manos de Cordova la función de login.
En su forma web, bastaría con cargar su index.html, estando lista para instalar en un servidor web. En su variante de Electron, ejecutamos el archivo .exe y se instalaría en el escritorio, y al arrancar se abriría una ventana propia.

## Estructura de directorios y archivos

La estructura de directorios es la siguiente:

```txt
app_juegos/
|
|----.vscode/typings/cordova
|----node_modules/
|----out/
|----platforms/
|    |----browser/
|    |----electron/
|----typings
|----www
|    |----bootstrap/
|    |----css/
|    |       |----style.css
|    |----img/
|    |----js/
|    |      |----index.js
|    |      |----jquery.min.js
|    |      |----md5.min.js
|    |----index.html
|----config.xml
|----jsconfig.json
|----package.json
|----package.json
```

- Como aplicación que depende de **módulos de NPM**, este proyecto cuenta con sus archivos JSON de configuración de paquetes, además de otro de configuración, vacío en principio. Junto a estos está la configuración del proyecto Cordova en formato XML.
- Es la carpeta www donde se encuentra la aplicación como tal y su estructura no dista tanto de la de una típica aplicación web, con sus directorios separando las imágenes, los archivos JS y la hoja de estilo CSS. Contamos además de forma local con la biblioteca de estilos **Bootstrap** (versión 5). Y el body de nuestra app está en el archivo index.
- La configuración, plugins, etc, de Cordova utilizan un tipado en TypeScript. Este es referenciado en typings hacia el archivo dentro de .vscode/typings/cordova.
- Las exportaciones a cada plataforma se hace en la correspondiente carpeta de platforms. En nuestro caso, exportamos para navegador y Electron, un framework para generar aplicaciones híbridas de escritorio basadas en **Chromium**.
- Hemos generado documentación técnica de nuestra app. Al estar programada en Javascript, nos hemos decantado por **JSDoc** para ello. Hemos incluido dentro de la misma este mismo documento. La carpeta Out contiene el output de dicho módulo, una sencilla web que explica nuestras variables, funciones...
- Los módulos de Node instalados, como en toda app de este tipo, se encuentra en el directorio node_modules.

## Librerías instaladas

- [Apache Cordova 12.0.1](https://cordova.apache.org/)
- [JQuery 3.6.4](https://jquery.com/)
- [Bootstrap 5.3.0](https://getbootstrap.com/)
- [MD5](https://github.com/blueimp/JavaScript-MD5/blob/master/js/md5.min.js)
- [JSDoc](https://jsdoc.app/index.html)
