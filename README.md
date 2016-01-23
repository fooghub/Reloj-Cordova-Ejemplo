 ## Reloj-Cordova-Ejemplo" 

**Reloj calendario**, es una aplicación de código abierto para dispositivos móviles. Programada con **HTML 5** , **CSS3**, **Javascript** (jQuery - jQuery Mobile) y el marco de desarrollo multiplataforma **Apache CORDOVA**&#8482;.

##### HTML5 

Con **jQuery Mobile** y algunos de sus recursos (archivos, www/**index.html**, www/**html/licencia.html**, y www/**html/calendario.html**).

Páginas (**page**) múltiples: www/**index.html** contiene dos páginas : ***#index*** (principal, con el lienzo -**canvas**- del reloj) y ***#ajustes***, con un conjunto de elementos desplegables (**collapsible**). 

Panel lateral (**panel**), con el menú de opciones de configuración e información.

Listas (**listview**). Cuadrículas (**grid**) y tablas (**table**).

Ventanas emergentes (**popup**), de los tipos: descartable, no descartable y modal.

Botones tipo, "ancla" (*anchor*) , botón (**button**), seleccionables: **radio** y **flipswitch**. 

Iconos (**icon**) incorporados en la interfaz y otros personalizados.

Barra de desplazamiento o progreso con **range**. Efectos de transición (**transition**) y **scroll**, etc. 

##### CSS3 

Con **jQuery Mobile** (**jquery.mobile-1.4.5.css**).

El archivo www/**css/index-comentado.css** contiene la "**hoja de estilos**", de la aplicación. Con identificadores, clases propias, clases de **jQuery Mobile** personalizadas y algunos recursos y código de otros autores. La versión reducida (comprimida con **YUI Compressor**) es, www/**css/index-min.css**. 

##### JAVASCRIPT

Con **jQuery** y **jQuery Mobile** (**jquery-1.11.3.js - jquery.mobile-1.4.5.js**).

El archivo www/**js/index-comentado.js** contiene la programación **Javascript**. La versión comprimida (con **Google Closure Compiler**) es, www/js/**index-min.js**.

Esta es una aplicación experimental fuera de los circuitos de distribución comerciales (Google Play Store, App Store, etc) con **Javascript** incorpora un sistema de actualizaciones vía internet. Ver archivo : 

##### IMÁGENES

El directorio wwww/**res/*** contiene las imágenes: **logo** de la aplicación y **pantallas** de bienvenida. En formato **.png** y el tamaño adecuado para cada posición y tipo de dispositivo con **Android**.

La asociación de estas imágenes con la instalación y lanzamiento de la aplicación se consigue mediante el código de **config.xml**

(ver etiquetas `<icon src="..." />`, `<icon density=" ... " src=" ..." />` y `<splash density=" ... " src=" ... " />`).   


##### CORDOVA&#8482;

**Apache CORDOVA&#8482;**. Es un marco de desarrollo de código abierto que permite utilizar las tecnologías estándar web para construir aplicaciones  multiplataforma, evitando el lenguaje de desarrollo nativo (**Java**, en **Android**) de cada uno de los sistemas operativos de la práctica totalidad de los dispositivos móviles del mercado actual. Documentación en, [https://cordova.apache.org/](https://cordova.apache.org/ "Apache Cordova").

Para conseguir la completa funcionalidad con la que fue diseñada esta aplicación, será necesario añadir los siguientes complementos (**plugins**):

* **cordova-plugin-device** : Define un objeto global ***device***, que describe el hardware y el software del dispositivo. No estará disponible hasta después de desencadenado el evento ***deviceready***. [https://github.com/apache/cordova-plugin-device](https://github.com/apache/cordova-plugin-device "cordova-plugin-device ").

*  **cordova-plugin-splashscreen** : Muestra y oculta una pantalla de bienvenida durante la puesta en marcha de la aplicación. [https://github.com/apache/cordova-plugin-splashscreen](https://github.com/apache/cordova-plugin-splashscreen "cordova-plugin-splashscreen").

* **cordova-plugin-network-information** : Proporciona información acerca de la conexión telefónica y Wi-Fi del dispositivo y si.este dispone de una conexión a Internet. [https://github.com/apache/cordova-plugin-network-information](https://github.com/apache/cordova-plugin-network-information "cordova-plugin-network-information").

* **io.litehelpers.cordova.sqlite** : Interfaz nativa de **SQLite** en Cordova. La aplicación **Reloj** incorpora una pequeña base de datos local (**reloj.db**), situada en el directorio raíz para conservar los cambios de configuración realizados por el usuario. Documentación de este plugin en, [https://github.com/litehelpers/Cordova-sqlite-storage](https://github.com/litehelpers/Cordova-sqlite-storage "Cordova-sqlite-storage").

* **com.darktalker.cordova.screenshot** : Permite a la aplicación tomar capturas de la pantalla actual y almacenar las imágenes en el dispositivo. [https://github.com/gitawego/cordova-screenshot](https://github.com/gitawego/cordova-screenshot "cordova-screenshot").

* **cordova-plugin-nativeaudio** : Extensión para la reproducción de audio nativo. [https://github.com/floatinghotpot/cordova-plugin-nativeaudio](https://github.com/floatinghotpot/cordova-plugin-nativeaudio "cordova-plugin-nativeaudio").

* **cordova-plugin-dialogs** : Proporciona acceso a algunos elementos de la interfaz de diálogo nativa a través de un objeto global ***navigator.notification***, que no estará disponible hasta después del evento  ***deviceready***. Documentación, [https://github.com/apache/cordova-plugin-dialogs](https://github.com/apache/cordova-plugin-dialogs "cordova-plugin-dialogs").

* **cordova-plugin-file** : Implementa una API que permite el acceso en el modo de lectura / escritura a los archivos que residen en el dispositivo. [https://github.com/apache/cordova-plugin-file](https://github.com/apache/cordova-plugin-file "cordova-plugin-file")

* **cordova-plugin-file-transfer** : Permite cargar y descargar archivos. Define los constructores globales de función, ***FileTransfer*** y ***FileUploadOptions***, disponibles después del evento ***deviceready***. [https://github.com/apache/cordova-plugin-file-transfer](https://github.com/apache/cordova-plugin-file-transfer "cordova-plugin-file-transfer").

* **com.borismus.webintent** : Web Intent es un marco experimental para la comunicación entre aplicaciones. Este plugin se utiliza, entre otros usos, para abrir paquetes ***Android.apk***. [https://github.com/Initsogar/cordova-webintent](https://github.com/Initsogar/cordova-webintent "cordova-webintent").

* **ionic-plugin-keyboard** : El objeto ***cordova.plugins.Keyboard*** ofrece funciones para hacer la interacción con el teclado más fácil, y desencadena eventos para indicar cuando el teclado virtual del dispositivo se abre / cierra. Documentación, [https://github.com/driftyco/ionic-plugin-keyboard](https://github.com/driftyco/ionic-plugin-keyboard "ionic-plugin-keyboard").

* **cordova-plugin-battery-status** : Indica el estado de la batería (porcentaje disponible) y detecta, en su caso, si se está cargando. [https://github.com/apache/cordova-plugin-battery-status](https://github.com/apache/cordova-plugin-battery-status "cordova-plugin-battery-status")

* **cordova-plugin-file-transfer** : Permite cargar y descargar archivos. Define los constructores globales de función, ***FileTransfer*** y ***FileUploadOptions***, disponibles después del evento ***deviceready***. [https://github.com/apache/cordova-plugin-file-transfer](https://github.com/apache/cordova-plugin-file-transfer "cordova-plugin-file-transfer").

* **uk.co.workingedge.phonegap.plugin.istablet** : Indica si el dispositivo (**Android** o **iOS**) es una "**tablet**". [https://github.com/dpa99c/phonegap-istablet#readme](https://github.com/dpa99c/phonegap-istablet#readme "phonegap-istablet").

* **cordova-plugin-inappbrowser**: Proporciona directamente una vista, integrada en la aplicación, del navegador web del sistema. [https://github.com/apache/cordova-plugin-inappbrowser.](https://github.com/apache/cordova-plugin-inappbrowser)

* ***cordova-plugin-whitelist*** : *Controla qué direcciones URL de la aplicación pueden solicitarse al sistema (para abrir). Por defecto, no se permiten las URL externas. Cordova añade automáticamente este plugin, en el momento de la creación del proyecto*.

##### ANDROID

Los recursos que presenta esta aplicación están orientados y optimizados para **Android** y su funcionamiento se ha probado sólo en dispositivos con esta plataforma.

##### DOCUMENTACIÓN

Para más y mejor información sobre el contenido de este proyecto, puedes leer el documento:

>Enlace a documento (Repositorio en obras. Disculpa las molestias).

En el que además se detalla el procedimiento completo para construir una aplicación *móvil* con CORDOVA, basado en el código disponible en este repositorio.

Saludos.

-------------

2004 - 2016 - Foog.Software

[www.foog.es](http://www.foog.es)


  

.





  
