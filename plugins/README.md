### plugins

----

En este directorio, **CORDOVA** almacena con antelación a la compilación, los archivos correspondientes a los **plugins** agregados.
 
Para conseguir la completa funcionalidad con la que fue diseñada esta aplicación, será necesario añadir los siguientes complementos (**plugins**):

```
$ cordova plugin add [plugin] 
```

* **cordova-plugin-device** : Define un objeto global ***device***, que describe el hardware y el software del dispositivo. No estará disponible hasta después de desencadenado el evento ***deviceready***. 

*  **cordova-plugin-splashscreen** : Muestra y oculta una pantalla de bienvenida durante la puesta en marcha de la aplicación. 

* **cordova-plugin-network-information** : Proporciona información acerca de la conexión telefónica y Wi-Fi del dispositivo y si.este dispone de una conexión a Internet.

* **io.litehelpers.cordova.sqlite** : Interfaz nativa de **SQLite** en Cordova. La aplicación **Reloj** incorpora una pequeña base de datos local (**reloj.db**), situada en el directorio raíz para conservar los cambios de configuración realizados por el usuario. 

* **com.darktalker.cordova.screenshot** : Permite a la aplicación tomar capturas de la pantalla actual y almacenar las imágenes en el dispositivo. 

* **cordova-plugin-nativeaudio** : Extensión para la reproducción de audio nativo. 

* **cordova-plugin-dialogs** : Proporciona acceso a algunos elementos de la interfaz de diálogo nativa a través de un objeto global ***navigator.notification***, que no estará disponible hasta después del evento  ***deviceready***. 

* **cordova-plugin-file** : Implementa una API que permite el acceso en el modo de lectura / escritura a los archivos que residen en el dispositivo. 

* **cordova-plugin-file-transfer** : Permite cargar y descargar archivos. Define los constructores globales de función, ***FileTransfer*** y ***FileUploadOptions***, disponibles después del evento ***deviceready***. 

* **com.borismus.webintent** : Web Intent es un marco experimental para la comunicación entre aplicaciones. Este plugin se utiliza, entre otros usos, para abrir paquetes ***Android.apk***. 

* **ionic-plugin-keyboard** : El objeto ***cordova.plugins.Keyboard*** ofrece funciones para hacer la interacción con el teclado más fácil, y desencadena eventos para indicar cuando el teclado virtual del dispositivo se abre / cierra. 

* **cordova-plugin-battery-status** : Indica el estado de la batería (porcentaje disponible) y detecta, en su caso, si se está cargando.

* **cordova-plugin-file-transfer** : Permite cargar y descargar archivos. Define los constructores globales de función, ***FileTransfer*** y ***FileUploadOptions***, disponibles después del evento ***deviceready***.

* **uk.co.workingedge.phonegap.plugin.istablet** : Indica si el dispositivo (**Android** o **iOS**) es una "**tablet**".

* **cordova-plugin-inappbrowser**: Proporciona directamente una vista, integrada en la aplicación, del navegador web del sistema.

* ***cordova-plugin-whitelist*** : *Controla qué direcciones URL de la aplicación pueden solicitarse al sistema (para abrir). Por defecto, no se permiten las URL externas. Cordova añade automáticamente este plugin, en el momento de la creación del proyecto*.

----
