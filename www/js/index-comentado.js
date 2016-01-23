/**
* Aplicación: Reloj - Javascript
* Archivo: index-comentado.js // Depurado con : JS Bin, https://jsbin.com/
* Autor: Francisco J. Gómez.
* 2004, 2015 Foog.Software.
* MIT License (MIT).
**
* Dependencias:
* - jQuery 1.11.3 https://jquery.com/
* - jQueryMobile 1.4.5 https://jquerymobile.com/
* - iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org 
* - toast v1.00 https://github.com/tutcugil/ToastJS 
**/	
	
	
/**
* Prototipos 'prototype' :
* Adicción de la función 'center' (que consigue centrar vertical y horizontalmente en pantalla, una capa 'absolute')
* a la propiedad 'fn' de la función constructora 'jQuery' (también representada por '$').
* http://stackoverflow.com/questions/210717/using-jquery-to-center-a-div-on-the-screen
**/

jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
	return this;
};

/**
* capitalizarPrimeraLetra - Función. Convierte a mayúscula la primera letra de una cadena.
**/

String.prototype.capitalizarPrimeraLetra = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
* Estructura siguiente ...
* Objeto 'programa', variables y funciones de propósito general:
* var programa = { ... , ...};	
* Objeto 'dispositivo', variables, funciones y escucha de eventos:
* con dependencia de CORDOVA nativo y CORDOVA complementos (plugins):
* var dispositivo = {	..., ...};
* Tareas en el inicio y escucha de eventos generales:  
* $(document).on("pagecreate","#index",function(evento){... ;	... ;});
**/	

var programa = {
	
	/**
	* pausar - Acciones para el evento 'pause'. 	
	**/
	 
	pausar : function(evento){
		evento.preventDefault();
		switch(programa.ventana.hoja.id){
			case "index":
			if(programa.ventana.panel.abierto) $( "#opciones" ).panel( "close" );
			if(programa.ventana.emergente.id !== "" ) $("#" + programa.ventana.emergente.id).popup( "close" );
			break;
			case "ajustes":
			if(!programa.navegar.enCurso && !programa.actualizaciones.comprobar.enCurso && !programa.actualizaciones.descargar.enCurso ){
				$("#ajustes-regresar").trigger("click");	
			}
			break;
			case "licencia" :
			if(!programa.navegar.enCurso) $("#licencia-regresar").trigger("click");
			break;
		}
		if(programa.navegar.enCurso) programa.navegar.enCurso = false;
	},
	
	/**
	* reanudar - Acciones para el evento 'resume'. 	
	**/

	reanudar : function(evento){
		evento.preventDefault();
		switch(programa.ventana.hoja.id){
			case "index":
			programa.pantalla.centrarReloj(); 
			break;
			case "ajustes":
			programa.ventana.protector.desactivar();
			if(!programa.actualizaciones.comprobar.enCurso && !programa.actualizaciones.descargar.enCurso){
				$("#ajustes-regresar").trigger("click");	
			}else{
				if (!$("#ajustes-desplegable-actualizaciones").hasClass('ui-collapsible-collapsed')) {
					if($("#ajustes-actualizaciones-botones").hasClass("ui-disabled")) $("#ajustes-actualizaciones-botones").removeClass("ui-disabled");
				}
			}
			break;
			case "licencia" :
			$("#licencia-regresar").trigger("click");
			break;
			case "calendario" :
			programa.fecha.calendario.presentar();
			break;
		}		
	},
	
	/**
	* propiedades - (De la aplicación), nombre, versión, fecha de edición, etc.	
	**/
	 
	propiedades : {
		nombre : "Reloj",
		versiones : {larga : "0.0.0", corta : "0.0", tipo : "Alpha", compilado :"000"},
		tirada : "mes, año",
		paquete : "package",
		plataforma : "plataforma",
		serie : "serie",
		leerXML : function(){		
			$.ajax({
			type: "GET",
			url: "xml/reloj.xml",
			dataType: "xml"
			})
			.done(function(xml){
				$(xml).find("lanzamiento").each(function(){
					programa.propiedades.versiones.tipo = $(this).find("tipo").text();
					programa.propiedades.serie = $(this).find("serie").text();
					programa.propiedades.tirada = $(this).find("fecha").text();
					programa.fecha.fechaTirada = new programa.fecha.elaborar(programa.propiedades.tirada);
					programa.propiedades.tirada = programa.fecha.fechaTirada.mes + ", " + programa.fecha.fechaTirada.aaaa; 
					programa.actualizaciones.repositorio = $(this).find("protocolo").text() + $(this).find("dominio").text() + $(this).find("repositorio").text();
					});
			});	
		}
	},
	
	/**
	* fecha - Uso de fechas. 	
	**/

	fecha : {
		error : false,
		elaborar : function(objetoFecha){
			objetoFecha = objetoFecha || null;
			var mensaje = "";
			try{
				var fecha, D, M, A;
				if(objetoFecha !== null){
					if(isNaN(objetoFecha)){
						if(/^\d{1,2}[./-]\d{1,2}[./-]\d{4,}$/.test(objetoFecha)){
							objetoFecha = objetoFecha.replace(/\/|\./g,"-");
							objetoFecha = objetoFecha.split("-").reverse().join("-");
						}else if(/^\d{4,}[./-]\d{1,2}[./-]\d{1,2}$/.test(objetoFecha)){
							objetoFecha = objetoFecha.replace(/\/|\./g,"-");
						}else{
							throw "Wrong date format";	
						}
						D = objetoFecha.split("-")[2]; 
						M = objetoFecha.split("-")[1];
						A = objetoFecha.split("-")[0];
						
						if(A < 1000) A = 1000;
						if(A > 9999) A = 9999;
						if (M < 1) M  = 1;
						if (M > 12) M = 12;
						if (D < 1) D = 1;
						if (D > new Date(A, M, 0).getDate()) D = new Date(A, M, 0).getDate();
						if(D < 1 || D > 31 || M < 1 || M > 12){
							throw "Wrong date format";
						}
						if(A < 1000 || A > 9999){
							throw "Date out of range";
						}
						fecha = new Date(A, M -1, D);
				}else{
					if(parseInt(objetoFecha,10) < -30610227600000 || parseInt(objetoFecha,10) > 253402210800000){
						throw "Date out of range";
					}else{
						fecha =  new Date(parseInt(objetoFecha,10));
					}
				}
				}else{
					fecha = new Date();
				}
				var semana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
				var weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]; 
				var meses =  ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
				var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
				this.d = fecha.getDate();
				this.dd = ((this.d < 10) ? "0" + this.d : this.d);
				this.nDs =  fecha.getDay(); //Número de día de la semana
				this.dsemana = semana[this.nDs];
				this.wd = weekdays[this.nDs];
				this.m = fecha.getMonth() + 1;
				this.mm = ((this.m < 10) ? "0" + this.m : this.m);
				this.mes = meses[fecha.getMonth()];
				this.mo = months[fecha.getMonth()];
				this.aaaa = fecha.getFullYear();
				this.bisiesto = (new Date(this.aaaa, 2, 0).getDate() === 29) ? true : false;
				this.horas = ((fecha.getHours() < 10) ? "0" + fecha.getHours() : fecha.getHours());
				this.minutos = ((fecha.getMinutes() < 10) ? "0" + fecha.getMinutes() : fecha.getMinutes());
				this.segundos = ((fecha.getSeconds() < 10) ? "0" + fecha.getSeconds() : fecha.getSeconds());
				this.uDm = new Date(this.aaaa, this.m, 0).getDate(); //Último día del mes
				this.pDm = new Date(this.aaaa, this.m - 1, 1).getDay(); //Día de la semana del primero del mes	
				this.marcaTemporal = Date.parse(fecha);	
			}catch(err){
				mensaje = err;
			}finally{
				if(mensaje!== ""){
					programa.fecha.error = true;
					var argumentoError = mensaje;
					mensaje = "";
					programa.fecha.mostrarError(argumentoError);
				}
			}
		},

		mostrarError : function(error){
			var mensaje = "Error Fecha<br />" + error;
			var mensaje0, mensaje1;
			var cerrarAlerta = function(){		
			return;				
			};
			if (error === "Wrong date format"){
				mensaje0 = "Error Fecha\nLa fecha solicitada no es correcta.\nFormatos admitidos:\ndd/MM/aaaa\naaaa/MM/dd\nDonde:\n'dd', es el día.\n'MM' es el mes y\n'aaaa' es el año, con cuatro dígitos.\nEl separador puede ser:\n' / ', ' - ' ó ' . ' (punto).";
				mensaje1 = "La fecha solicitada no es correcta.\nFormatos admitidos:\ndd/MM/aaaa ó aaaa/MM/dd\nDonde:\n'dd', es el día.\n'MM' es el mes y\n'aaaa' es el año, con cuatro dígitos.\nEl separador puede ser:\n' / ', ' - ' ó ' . ' (punto).";
			}else if(error === "Date out of range"){
				mensaje0 = "Error Fecha\nLa fecha solicitada está fuera del rango soportado.\nMínimo:\n01/01/1000\nMáximo:\n31/12/9999";
				mensaje1 = "La fecha solicitada está fuera del rango soportado.\nMínimo:\n01/01/1000\nMáximo:\n31/12/9999";
			}else{
				mensaje0 = "Error Fecha\n" + error;
				mensaje1 = error;
			}
			if(programa.ventana.hoja.id === "calendario"){
				if(navigator.notification){
					/* Con complemento : 'cordova-plugin-dialogs' */
					navigator.notification.alert(
					mensaje1,  
					cerrarAlerta,         
					'Error Fecha',            
					'Aceptar'                 
					);
				}else{
					alert(mensaje0);
					cerrarAlerta();
				}
			}else{
				programa.fecha.error = false;
				programa.avisar(mensaje + ".", 4000, "bottom", "#ff0000");	
			}
		},
		
		/**
		* calendario - Interactúa con el objeto anterior (fecha). El rango está
		* limitado a las fechas comprendidas entre el 01/01/1000 y el 31/12/9999.
		* Los fomatos de cadena (literal) admitidos son : dd/MM/aaaa ó d/M/aaaa. 
		* También : aaaa/MM/dd y aaaa/M/d.
		**/

		calendario :{
			
			presentar : function(tiempo){
				tiempo = tiempo || null;				
				var fechasCalendario = (tiempo === null) ? new programa.fecha.elaborar() : new programa.fecha.elaborar(tiempo);
				if(programa.fecha.error){
					fechasCalendario = new programa.fecha.elaborar();
					programa.fecha.error = false;
				}
				var numMes = fechasCalendario.m;		
				var largoMes = fechasCalendario.uDm;
				var primeroMes = (fechasCalendario.pDm === 0) ? 7 : fechasCalendario.pDm; // Día de la semana del día uno del mes seleccionado. 
				var finalMes = primeroMes + largoMes;
				var anualidad = fechasCalendario.aaaa;
				var contador = 1;
				$("#calendario-anualidad").html(fechasCalendario.aaaa);
				$("#calendario-mensualidad").html(fechasCalendario.mes.toUpperCase());
				for(var i = 1; i <=42; i++){
					if($("#calendario-" + i).hasClass("fiestaAlternativa")) $("#calendario-" + i).removeClass("fiestaAlternativa");
					if($("#calendario-" + i).hasClass("fiesta")) $("#calendario-" + i).removeClass("fiesta");
					if($("#calendario-" + i).hasClass("fiestaEnDomingo")) $("#calendario-" + i).removeClass("fiestaEnDomingo");
					if($("#calendario-" + i).hasClass("seleccionado")) $("#calendario-" + i).removeClass("seleccionado");
					if (i < primeroMes || i >= finalMes){
						$("#calendario-" + i).html("&#160;");
					}else{
						$("#calendario-" + i).html(contador);
						//Coloca fiestas:
						if(anualidad >= 1582 && this.festivos(anualidad)[numMes].indexOf(contador) >= 0 ){
							if($("#calendario-" + i).hasClass("domingo")){
								$("#calendario-" + i).addClass("fiestaEnDomingo");						
							}else{
								if((numMes === 3 && contador === 19) || (numMes === 7 && contador === 25) ){
									$("#calendario-" + i).addClass("fiestaAlternativa");		
								}else{
									$("#calendario-" + i).addClass("fiesta");
								}
							}					
						} 
						if(contador === fechasCalendario.d) $("#calendario-" + i).addClass("seleccionado");
						contador++;
					}			
				}
				if($("#calendario-anualidad-retroceder").hasClass("ui-disabled")) $("#calendario-anualidad-retroceder").removeClass("ui-disabled");
				if($("#calendario-anualidad-avanzar").hasClass("ui-disabled")) $("#calendario-anualidad-avanzar").removeClass("ui-disabled");
				$("#calendario-campo-oculto").val("");
				$("#calendario-fecha").val("");
				$("#calendario-campo-oculto").val(fechasCalendario.dd + "/" + fechasCalendario.mm + "/" + fechasCalendario.aaaa);
				$("#calendario-fecha").val($("#calendario-campo-oculto").val());
				if(parseInt(fechasCalendario.aaaa,10) === 1000) $("#calendario-anualidad-retroceder").addClass("ui-disabled");
				if(parseInt(fechasCalendario.aaaa,10) === 9999) $("#calendario-anualidad-avanzar").addClass("ui-disabled");
		},

			buscar : function(modo){
				var fechaEntrada = "";
				var valorOculto = $("#calendario-campo-oculto").val().split("/");
				var jornada = parseInt(valorOculto[0], 10);
				var mensualidad = parseInt(valorOculto[1], 10);
				var anualidad = parseInt(valorOculto[2], 10);
				var largoMesSolicitado = new Date(anualidad, mensualidad, 0).getDate();	
				switch(modo){
					case "fechaSeleccionada":
					fechaEntrada = $("#calendario-fecha").val(); 
					break;
					case "anualidadAnterior":
					if(anualidad !== 1000){
						if(mensualidad === 2 && jornada === 29) jornada = 28;
						anualidad = anualidad - 1;
						fechaEntrada = jornada + "/" + mensualidad + "/" + anualidad;
					}else{
						$("#calendario-anualidad-retroceder").addClass("ui-disabled");
					return;
					}
					break;
					case "anualidadSiguiente":
					if(anualidad < 9999){
						if(mensualidad === 2 && jornada === 29) jornada= 28;
						anualidad = anualidad + 1;
						fechaEntrada = jornada + "/" + mensualidad + "/" + anualidad;
					}else{
						return;
					}
					break;
					case "mesAnterior" :
					mensualidad = mensualidad - 1; 
					if(mensualidad === 0){
						mensualidad = 12;
						anualidad = anualidad -1;
					}
					jornada =(jornada > largoMesSolicitado) ? largoMesSolicitado : jornada;
					jornada = (jornada.toString().length === 1) ? "0" + jornada : jornada.toString();
					mensualidad = (mensualidad.toString().length === 1) ? "0" + mensualidad : mensualidad.toString();
					anualidad = anualidad.toString();
					fechaEntrada = jornada + "/" + mensualidad + "/" + anualidad;
					break;
					case "mesSiguiente" :
					mensualidad = mensualidad + 1;
					if(mensualidad > 12){
						mensualidad = 1;
						anualidad = anualidad + 1;
					}
					jornada =(jornada > largoMesSolicitado) ? largoMesSolicitado : jornada;
					jornada = (jornada.toString().length === 1) ? "0" + jornada : jornada.toString();
					mensualidad = (mensualidad.toString().length === 1) ? "0" + mensualidad : mensualidad.toString();
					anualidad = anualidad.toString();
					fechaEntrada = jornada + "/" + mensualidad + "/" + anualidad;
					break;
				}
				if(fechaEntrada !== ""){
					this.presentar(fechaEntrada);	
				}
			}, 

			festivos : function (anualidad){
				anualidad = parseInt(anualidad,10);
				var fiestas = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
				if(anualidad >= 1979 ) fiestas = [[],[1,6],[],[19],[],[1],[],[25],[15],[],[12],[1],[8,25]];
				if(anualidad >= 1984 ) fiestas[12].push(6); 
				
				/**
				* computus - Función. Obtiene la fecha del domingo de Pascua (Easter Day), para el argumento de entrada (año). 
				* http://stackoverflow.com/questions/1284314/easter-date-in-javascript				 
				**/
				 
				var computus = function() {
					var C = Math.floor(anualidad / 100);
					var N = anualidad - 19 * Math.floor(anualidad / 19);
					var K = Math.floor((C - 17) / 25);
					var I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
					I = I - 30 * Math.floor((I / 30));
					I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28)*Math.floor(29 / (I + 1))*Math.floor((21 - N )/ 11));
					var J = anualidad + Math.floor(anualidad / 4) + I + 2 - C + Math.floor(C / 4);
					J = J - 7 * Math.floor(J / 7);
					var L = I - J;
					var M = 3 + Math.floor((L + 40 )/ 44);	
					var D = L + 28 - 31 * Math.floor(M / 4);
					var DR = [M,D]; // Pascua
					var SS = (M === 4 && D - 1 === 0) ? [3,31] : [M, D-1];
					var VS = (M === 4 && D - 2 <=  0) ? [3, 31 - Math.abs(D - 2)] : [M, D-2]; 
					var JS = (M === 4 && D - 3 <=  0) ? [3, 31 - Math.abs(D - 3)] : [M, D-3]; 
					if(anualidad >= 1979 ){
						fiestas[JS[0]].push(JS[1]); 
						fiestas[VS[0]].push(VS[1]); 
						fiestas[DR[0]].push(DR[1]); 	
					}else{
						fiestas[DR[0]].push(DR[1]); 
					}
				};	
				computus();
				return fiestas;
			},

		},
	}, 

	/**
	* avisar - Presenta en pantalla mensajes de aviso del tipo "toast".
	* @author Muhammet Tutcugil
	* @version 1.00
	* @repository https://github.com/tutcugil/ToastJS
	* @licence https://github.com/tutcugil/ToastJS/blob/master/LICENSE
	**/

	avisar : function(mensaje, permanencia, emplazamiento, fondo){
		switch (arguments.length -2) { 		
			case 0:  
			emplazamiento = "bottom";
			fondo = "#000000";
			break;
			case 1:
			fondo = "#000000";
			break;
		}		
		switch(permanencia){
			case 1000:
			permanencia = Toast.DURATION_SHORT;
			break;
			case 2000:
			permanencia = Toast.DURATION_NORMAL;
			break;
			case 3000:
			permanencia = Toast.DURACTION_AVERAGE; 
			break;
			case 4000:
			permanencia = Toast.DURATION_LONG;
			break;
			default:
			permanencia = Toast.DURATION_NORMAL;
		}
		switch(emplazamiento){
			case "top":
			emplazamiento = Toast.POSITION_TOP;
			break;
			case "middle":
			emplazamiento = Toast.POSITION_MIDDLE;
			break;
			case "bottom":
			emplazamiento = Toast.POSITION_BOTTOM;
			break;
			default:
			emplazamiento = Toast.POSITION_BOTTOM;
		}		
		Toast.show({
			message    : mensaje,
			position   : emplazamiento,
			duration   : permanencia,
			background : fondo	
		}); 		
	},
	
	/**
	* navegar - Función de control de navegación por Internet.
	**/
	
	navegar : {
		enCurso : false,
		url : function(selector){
			this.enCurso = true;
			if(dispositivo.obtenerEstadoDeRed()[0] === false){
				programa.avisar("No hay conexión ...", 4000); 
				this.enCurso = false;				
			}else{
				var url, referencia, modoApertura = "sistema";
				switch (selector){
					case  "ajustes-web-enlace" :
					url = "http://www.foog.es/";
					break;
					case "licencia-web-enlace":
					url = "http://www.foog.es/";
					break;
					case "ajustes-github-enlace":
					url = "https://github.com/fooghub/Reloj-Cordova-Ejemplo";
					if(/wifi/i.test(dispositivo.obtenerEstadoDeRed()[1]) && cordova.InAppBrowser) modoApertura = "navegadorPrograma"; 
					break;	
				}
				
				if (modoApertura === "navegadorPrograma"){
					/*Abre la página solicitada con: 'cordova-plugin-inappbrowser' */					
					referencia = cordova.InAppBrowser.open(url, "_blank", "location=yes");
					referencia.addEventListener("exit", function(){programa.navegar.enCurso = false;});
				}else{
					referencia = window.open(url, "_system");
				}				
			}	
		}	
	},
	
	/**
	* salir - Función. Salida de la aplicación.
	**/

	salir : function(){	
		
		if(navigator.app){
			dispositivo.sonido.id.forEach(function(identificador){dispositivo.sonido.remover(identificador);});
			navigator.app.exitApp();	
		}else{
			programa.avisar("Función no operativa", 3000);			
		}		
	},
	
	/**
	* pantalla - Cálculo de área máximo del contenedor del 'reloj' y control de desplazamiento 'scroll' de
	* la página principal.
	**/

	pantalla : {
		longitudCapaCentral : ((Math.round((Math.min.apply(Math,[$(window).width(),$(window).height()]) - 32)/10)*10) > 400 ? 400 : Math.round((Math.min.apply(Math,[$(window).width(),$(window).height()]) - 32)/10)*10),
		coordenadaSuperior : null,
		centrarReloj : function(){
			var coordenadaY = (programa.pantalla.coordenadaSuperior === null ) ? 0 : programa.pantalla.coordenadaSuperior;
			$.mobile.silentScroll(coordenadaY);
			$("#index-capa-central").center();			
			programa.pantalla.coordenadaSuperior = null;						
		}
	},
	
	/**
	* teclado - Oculta el 'pie' de la página 'ajustes' en función 
	* de si el teclado virtual del dispositivo está o no a la vista.
	* Complemento : 'ionic-plugin-keyboard'.
	**/
	
	teclado : {
		seAbre : function(){
			if($("#ajustes-pie").is(":visible")) $("#ajustes-pie").hide();
		},
		seCierra : function(){
			if(!$("#ajustes-pie").is(":visible")) $("#ajustes-pie").show();
		} 
	},
	
	/**
	* ventana - Operaciones con las ventanas de la aplicación, tipos: Página, panel y emergente (popup).
	**/
	
	ventana : {
		
		hoja : {
			id : "index", 
		},

		desplegable : {
			inicializado : false,
			solicitado : "",
			colapsar : function(elementoDesplegable){
				var selector = (/^#/.test(elementoDesplegable)) ? elementoDesplegable : "#" + elementoDesplegable;
				$(selector).collapsible("collapse");				
			},
			expandir : function(elementoDesplegable){
				var selector = (/^#/.test(elementoDesplegable)) ? elementoDesplegable : "#" + elementoDesplegable;
				$(selector).collapsible("expand");
			},
			abrirDesdePanel : function(elementoDesplegable){
				var selector = (/^#/.test(elementoDesplegable)) ? elementoDesplegable : "#" + elementoDesplegable;
				$( "#opciones" ).panel( "close" );
				programa.ventana.desplegable.solicitado = selector;
				$.mobile.changePage("#ajustes", {transition: "slide", reverse:true});
			}
		},
		
		/**
		* ventana - panel - Si es necesario, hace uso de:		 
		* iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
		* Released under MIT license, http://cubiq.org/license
		* para desplazarse por los botones centrales del menú.
		*/
		 
		
		panel : {
			abierto : false,
			desplazamiento : null,
			situarBotones : function(eventoTipo){
				switch(eventoTipo){
					case "panelbeforeopen" :
					if($("#opciones-varios").height() > $("#opciones-envoltura").height()){			
						if($("#opciones-varios").hasClass("opciones-varios-abajo")) $("#opciones-varios").removeClass("opciones-varios-abajo");
						$("#opciones-envoltura").css("overflow", "auto");
						programa.ventana.panel.desplazamiento = new iScroll('opciones-envoltura', {checkDOMChanges:true, hScroll: false, hScrollbar:false, vScroll: true, vScrollbar:true, hideScrollbar: true });
					}else{
						if(programa.ventana.panel.desplazamiento !== null){
							programa.ventana.panel.desplazamiento.desplazamiento.destroy();
							programa.ventana.panel.desplazamiento.desplazamiento = null;
						}
						$("#opciones-envoltura").css("overflow", "hidden");
						if(!$("#opciones-varios").hasClass("opciones-varios-abajo")) $("#opciones-varios").addClass("opciones-varios-abajo");
						}
					break;
					case "panelclose" :
					if(programa.ventana.panel.desplazamiento !== null){
						programa.ventana.panel.desplazamiento.destroy();
						programa.ventana.panel.desplazamiento = null;
					}
					if($("#opciones-varios").hasClass("opciones-varios-abajo")) $("#opciones-varios").removeClass("opciones-varios-abajo");
					break;
				}
			},
		},

		emergente : {
			id : "", 
			
			abrir: function(identificadorVentana){		
				var etiqueta = (/^#/.test(identificadorVentana)) ? identificadorVentana : "#" + identificadorVentana;
				if(programa.ventana.panel.abierto) $( "#opciones" ).panel( "close" );
				$(etiqueta).popup( "open" );		
			},
			
			oscilar :function(identificadorVentana){
				var etiqueta = (/^#/.test(identificadorVentana)) ? identificadorVentana : "#" + identificadorVentana;
				var movimiento, espera;
				var puntoInicialX = $(etiqueta).offset().left;
				var puntoFinalX = puntoInicialX + 4;		
				movimiento = setInterval(function(){
					var puntoActualX = $(etiqueta).offset().left;
					if(puntoActualX === puntoInicialX){ 
						$(etiqueta).offset({left: puntoFinalX});			
					}else{
						$(etiqueta).offset({left: puntoInicialX});
					}	
				}, 10);	
				clearTimeout(espera);
				espera = setTimeout(function(){
				clearInterval(movimiento);
				$(etiqueta).offset({left: puntoInicialX});
				}, 1500);
			},
		}, 
		
		/**
		* ventana - protector - Máscara que se consigue inhabilitando la página a la vista y
		* modificando la opacidad en la clase 'ui-disabled', con 'CSS'. 
		**/
		
		protector : {
			desplegado: false,
			activar : function (hoja,imagenGiro){
				imagenGiro = imagenGiro || false;
				if(!$("#" + hoja).hasClass("ui-disabled")) $("#" + hoja).addClass("ui-disabled"); 
				if(!programa.ventana.protector.desplegado) programa.ventana.protector.desplegado = true;
				if(imagenGiro) $.mobile.loading("show");
			},

			desactivar :function(hoja,latencia){
				latencia = latencia || 0;
				var retraso;
				clearTimeout(retraso);
				retraso = setTimeout(function(){
					if($("#" + hoja).hasClass("ui-disabled")) $("#" + hoja).removeClass("ui-disabled"); 				
					if(programa.ventana.protector.desplegado) programa.ventana.protector.desplegado = false;
					$.mobile.loading("hide");
				},latencia);			
			}
		}, 
	}, 
	
	/**
	* reloj - Inspirado en:
	* Canvas Clock de W3Schools.
	* http://www.w3schools.com/canvas/canvas_clock.asp
	**/
	
	
	reloj : {
		
		marca : "",
		tema : "bn", 
		coloresYfamilia : {			
			bn : ["#FFFFFF", "#E0E0E0", "#FFFFFF", "#303030", "#303030", "#707070", "#202020", "#202020", "#707070", "#000000", "#080808", "#101010", "Giorgio"],
			ba : ["#E0E0E0", "#C8C8C8", "#D8D8D8", "#000033", "#000033", "#000033", "#000033", "#000033", "#330033", "#000033", "#00003D", "#000047", "Times New Roman"],
			nb : ["#000000", "#000000", "#282828", "#808080", "#FFFFFF", "#F8F8F8", "#E8E8E8", "#E0E0E0", "#F8F8F8", "#E8E8E8", "#F0F0F0", "#FFFFFF", "Giorgio"],
			nr : ["#000000", "#000000", "#282828", "#800000", "#F80000", "#F00000", "#E80000", "#E00000", "#F00000", "#E80000", "#E00000", "#FF0000", "Giorgio"],
		},
		dibujarEsfera : function(contexto, radio) {		
			contexto.beginPath();
			contexto.arc(0, 0, radio, 0, 2 * Math.PI);
			contexto.fillStyle = this.coloresYfamilia[this.tema][0];
			contexto.fill();
			var colorDegradado = contexto.createRadialGradient(0, 0, radio * 0.95 , 0, 0, radio * 1.05);
			colorDegradado.addColorStop(0, "#202020");
			colorDegradado.addColorStop(0.5, "#FFFFFF");
			colorDegradado.addColorStop(1, "#202020");
			contexto.strokeStyle = colorDegradado;
			contexto.lineWidth = radio * 0.1;
			contexto.stroke();			
			if (radio >= 47){
				//Caja del calendario diario:	
				contexto.fillStyle = this.coloresYfamilia[this.tema][1];
				contexto.fillRect(radio * 0.303, radio * 0.048, radio * 0.144, radio *0.128);
				// Fondo caja:
				contexto.fillStyle = this.coloresYfamilia[this.tema][2];
				contexto.fillRect(radio * 0.308, radio * 0.048, radio *0.144, radio *0.128);
				contexto.lineWidth = radio * 0.010;
				// Recuadro caja:
				contexto.strokeStyle = this.coloresYfamilia[this.tema][3];
				contexto.strokeRect(radio * 0.293, radio * 0.048, radio * 0.168, radio * 0.144);
				if (programa.reloj.marca !== "") programa.reloj.dibujarMarca(contexto, radio);			
			}
		},

		dibujarMarca : function(contexto,radio){
			contexto.textBaseline = "middle";
			contexto.textAlign = "center";
			contexto.font =  "400 " + radio * 0.075 + "px " + this.coloresYfamilia[this.tema][12];
			contexto.fillStyle = this.coloresYfamilia[this.tema][4];
			contexto.fillText(this.marca, 0, -radio * 0.240);
			contexto.fillStyle = this.coloresYfamilia[this.tema][5];
			contexto.font = radio * 0.074 + "px " + this.coloresYfamilia[this.tema][12]; 
			contexto.fillText("reloj", 0, -radio * 0.149);				
		},

		dibujarCifras : function(contexto, radio) {
			var angular;
			contexto.font = (radio >= 42) ? "Bold " + radio * 0.12 + "px " + this.coloresYfamilia[this.tema][12] : radio * 0.12 + "px " + this.coloresYfamilia[this.tema][12];
			contexto.textBaseline = "middle";
			contexto.textAlign = "center";
			contexto.lineCap = "butt";
			contexto.strokeStyle = this.coloresYfamilia[this.tema][6];
			contexto.fillStyle = this.coloresYfamilia[this.tema][6];
			if(radio > 10 ) {
				if (radio < 47){
					for(var cifra = 1; cifra < 13; cifra++){
						angular = cifra * Math.PI / 6;
						contexto.rotate(angular);
						contexto.translate(0, -radio * 0.85);
						contexto.rotate(-angular);
						contexto.fillText(cifra.toString(), 0, 0);
						contexto.rotate(angular);
						contexto.translate(0, radio * 0.85);
						contexto.rotate(-angular);
					}
				}else{
					contexto.lineCap = "butt";
					var ajuste = ( radio * 0.0078), seno, coseno, sx, sy, ex, ey, nx, ny;
					for (var marcador = 1; marcador <= 60; marcador ++) {
						angular= Math.PI/30 * marcador;
						seno= Math.sin(angular);
						coseno= Math.cos(angular);
						//Cuando el módulo de ladivisión por 5 es igual a cero, traza un marcador de hora y su número correspondiente.
						if (marcador % 5 === 0) {
							contexto.lineWidth = (radio * 0.04); 
							sx = seno * 95 * ajuste;
							sy = coseno* -95 * ajuste;
							ex = seno * 120 * ajuste;
							ey = coseno * -120 * ajuste;
							nx = seno * 80 * ajuste;
							ny = coseno * -80 * ajuste ;
							var romanos = ["","I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
							if(this.tema === "ba"){
								contexto.fillText(romanos[marcador/5], nx, ny);
							}else{
								contexto.fillText(marcador/5, nx, ny);
							}
						//En el caso contrario, traza sólo un marcador de minutos:
						} else {
							contexto.lineWidth = radio * 0.011;
							sx = seno * 110 * ajuste;
							sy = coseno * 110 * ajuste;
							ex = seno * 120 * ajuste;
							ey = coseno * 120 * ajuste;
						}
						contexto.beginPath();
						contexto.moveTo(sx, sy);
						contexto.lineTo(ex, ey);
						contexto.stroke();
					}
				}
			}		
		},			

		dibujarAguja : function(contexto, tiempo, longitud, anchura){
			contexto.beginPath();
			contexto.lineWidth = anchura;
			contexto.lineCap = "round";
			contexto.moveTo(0,0);
			contexto.rotate(tiempo);
			contexto.lineTo(0, -longitud);
			contexto.stroke();
			contexto.rotate(-tiempo);				
		},

		cronometrar : function(contexto, radio){
			var ahora = new Date();
			var jornada = ahora.getDate();
			var hora = ahora.getHours();
			var meridiano = (hora > 12) ? "PM" : "AM";
			if(this.marca !== "") meridiano = meridiano.toLowerCase();
			var minuto = ahora.getMinutes();
			var segundo = ahora.getSeconds();
			var anualidad = ahora.getFullYear();		
			if (radio >= 47){
				// Día del calendario:
				contexto.fillStyle = this.coloresYfamilia[this.tema][7];				
 				contexto.font = (this.tema === "ba") ? "bold " + radio * 0.084 + "px " + this.coloresYfamilia[this.tema][12] : "bold " + radio * 0.078 + "px " + this.coloresYfamilia[this.tema][12]; 
				var px = (jornada.toString().length === 2) ? (radio * 0.378) : (radio * 0.374); 
				var py = (this.tema === "ba") ? (radio * 0.122) : (radio * 0.135);		
				contexto.fillText(jornada, px, py);
				//Año en curso /meridiano:
				contexto.fillStyle = this.coloresYfamilia[this.tema][8];
				contexto.font= radio * 0.074 +"px " + this.coloresYfamilia[this.tema][12]; //base 14px,			
				contexto.fillText(meridiano,0,radio * 0.170);
				contexto.fillText(anualidad,0,radio * 0.265);			
			}
			//Hora:
			contexto.strokeStyle = this.coloresYfamilia[this.tema][9];
			hora = hora % 12;
			hora = (hora * Math.PI/6)+(minuto * Math.PI/(6 * 60))+(segundo * Math.PI/(360 * 60));
			programa.reloj.dibujarAguja(contexto, hora, radio * 0.5, radio * 0.07);
			//Minuto:
			contexto.strokeStyle = this.coloresYfamilia[this.tema][10];			
			minuto=(minuto * Math.PI/30)+(segundo * Math.PI/(30 * 60));
			programa.reloj.dibujarAguja(contexto, minuto, radio * 0.8, radio * 0.07);
			// Segundos:
			contexto.strokeStyle = this.coloresYfamilia[this.tema][11];
			segundo=(segundo * Math.PI/30);
			programa.reloj.dibujarAguja(contexto, segundo, radio * 0.9, radio * 0.02);
			//Circulo central (aguja del segundero):
			contexto.beginPath();
			contexto.arc(0, 0, radio*0.1, 0, 2 * Math.PI);
			contexto.fillStyle = this.coloresYfamilia[this.tema][11];
			contexto.strokeStyle = this.coloresYfamilia[this.tema][11];
			contexto.fill();	
		},

		cargar: function(contexto,radio){			
			programa.reloj.dibujarEsfera(contexto, radio);
			programa.reloj.dibujarCifras(contexto, radio);
			programa.reloj.cronometrar(contexto, radio);				
		},

		accionar: function(){		
			var lienzo, contexto, radio, intervalo; 
			lienzo = document.getElementById("reloj");
			contexto = lienzo.getContext("2d");
			radio = lienzo.height / 2;
			contexto.translate(radio, radio);
			radio = radio * 0.94;
			intervalo = setInterval(function(){
				programa.reloj.cargar(contexto, radio);
			}, 1000);		
		},

	}, 
	
	/**
	* restaurarFormulario - Acciones para restablecer los elementos de los 'formularios' de la
	* página 'ajustes'.
	**/

	restaurarFormulario : function(formulario, tipoEvento){
		tipoEvento = tipoEvento || null;
		switch(formulario){
			case "ajustes-formulario-marca" :
			$("#ajustes-marca-entrada-texto").val("");
			$("#ajustes-marca-campo-oculto").val("");
			$("#ajustes-marca-entrada-texto").textinput("disable");
			$("#ajustes-marca-guardar-cambios").button("disable");
			$("#ajustes-marca-advertencia").html("<span style='color:#696969;'>(Máximo dieciocho caracteres)</span>");	
			$("#ajustes-marca-actual").html(((programa.reloj.marca === "") ? "(no tiene)" : programa.reloj.marca));			
			if(programa.reloj.marca === ""){
				$("#ajustes-marca-alternativa-editar").checkboxradio("enable");
				$("#ajustes-marca-alternativa-editar").prop( "checked", false ).checkboxradio( "refresh" );
				$("#ajustes-marca-alternativa-eliminar" ).prop( "checked", false ).checkboxradio( "refresh" );
				$("#ajustes-marca-alternativa-eliminar").checkboxradio("disable");
			}
			else{
				$("#ajustes-marca-alternativa-editar").checkboxradio("enable");
				$("#ajustes-marca-alternativa-editar" ).prop( "checked", false ).checkboxradio( "refresh" );
				$("#ajustes-marca-alternativa-eliminar").checkboxradio("enable");
				$("#ajustes-marca-alternativa-eliminar" ).prop( "checked", false ).checkboxradio( "refresh" );
			}
			break;
			case "ajustes-formulario-tema" :
			$("#ajustes-tema-guardar-cambios").button("disable");
			$("#ajustes-tema-campo-oculto").val("");		
			if($("input:radio[name=ajustes-temas]:checked").val() !== programa.reloj.tema){
				$("input:radio[name=ajustes-temas]:checked").prop("checked", false).checkboxradio("refresh");
				$('input[type="radio"][value="' + programa.reloj.tema +'"]').prop("checked", true).checkboxradio("refresh");
			} 		
			$("#ajustes-tema-actual").html(programa.reloj.tema.toUpperCase());
			break;
			case "ajustes-formulario-sonido" :
			if(!dispositivo.sonido.tictac && $("#ajustes-sonido-tictac").val() === "on") $("#ajustes-sonido-tictac").val("off").flipswitch("refresh");
			if($("#ajustes-sonido-tictac").val() === "off"){$("#ajustes-sonido-advertencia").css("color","#696969");}else{$("#ajustes-sonido-advertencia").css("color","#FFFFFF");}
			break;
			case "ajustes-formulario-captura" :
			$("#ajustes-captura-advertencia").css("color","#696969");
			$("#ajustes-captura-guardar-cambios").button("disable");
			if($("input:radio[name=ajustes-captura-formato]:checked").val() !== programa.capturaDePantalla.formato){
				$("input:radio[name=ajustes-captura-formato]:checked").prop("checked", false).checkboxradio("refresh");
				$('input[type="radio"][value="' + programa.capturaDePantalla.formato +'"]').prop("checked", true).checkboxradio("refresh");
			} 
			if($("input:radio[name=ajustes-captura-calidad]:checked").val() !== programa.capturaDePantalla.calidad){
				$("input:radio[name=ajustes-ajustes-captura-calidad]:checked").prop("checked", false).checkboxradio("refresh");
				$('input[type="radio"][value="' + programa.capturaDePantalla.calidad +'"]').prop("checked", true).checkboxradio("refresh");
			}
			break;
			case "ajustes-formulario-actualizaciones" :
			programa.actualizaciones.versiones.nueva = "";	
			programa.actualizaciones.versiones.ruta = "";		
			programa.actualizaciones.error = "";	
			$("#ajustes-actualizaciones-tarea").html("&#160;");
			$("#ajustes-actualizaciones-barra-progreso").val(0).slider("refresh");
			$("#ajustes-actualizaciones-barra-progreso").slider("disable");	
			if(tipoEvento === "collapsibleexpand") $("#ajustes-actualizaciones-barra-progreso").next().find(".ui-slider-handle").hide();
			$("#ajustes-actualizaciones-porcentaje-cifra").text("0");
			if($("#ajustes-actualizaciones-porcentaje").hasClass("ui-disabled")) $("#ajustes-actualizaciones-porcentaje").removeClass("ui-disabled") ;
			$("#ajustes-actualizaciones-porcentaje").css ("visibility", "hidden");
			$("#ajustes-actualizaciones-noticia").html("&#160;");
			$("#ajustes-actualizaciones-noticia1").html("&#160;");
			$("#ajustes-actualizaciones-error").html("&#160;");
			if($("#ajustes-actualizaciones-guardar-cambios").val() !== "Comprobar") $("#ajustes-actualizaciones-guardar-cambios").val("Comprobar").button("refresh");
			if(/wifi|ethernet|desconocida/i.test(dispositivo.obtenerEstadoDeRed()[1])){
				$("#ajustes-actualizaciones-guardar-cambios").button("enable");
				$("#ajustes-actualizaciones").html("Versión instalada:&#160;" + programa.propiedades.versiones.larga);
			}else{
				$("#ajustes-actualizaciones").html("<span><img src='img/check-white.png' alt=''></span><span>&#160;&#160;Sólo con WiFi</span>");
				$("#ajustes-actualizaciones-guardar-cambios").button("disable");
			}
			break;
			case "ajustes-formulario-dispositivo" :
			if(tipoEvento === "collapsibleexpand"){
				$("#ajustes-dispositivo-tipo").html(dispositivo.propiedades.tipo);
				$("#ajustes-dispositivo-red").html(dispositivo.obtenerEstadoDeRed()[1]);
				$("#ajustes-dispositivo-modelo").html(dispositivo.propiedades.modelo);
				$("#ajustes-dispositivo-sistema").html(dispositivo.propiedades.plataforma.nombre + " " + dispositivo.propiedades.plataforma.versiones);	
				$("#ajustes-dispositivo-pantalla").html(dispositivo.propiedades.dimensiones);
				$("#ajustes-dispositivo-pantalla-pr").html(dispositivo.propiedades.ratio);
				$("#ajustes-dispositivo-uuid").html(dispositivo.propiedades.uuid);
				if(dispositivo.acumulador.nivel !== ""){$("#ajustes-dispositivo-acumulador-nivel").text(dispositivo.acumulador.nivel);}else{$("#ajustes-dispositivo-acumulador-nivel").text("X");}
				if(dispositivo.acumulador.conectado){$("#ajustes-dispositivo-acumulador-conectado").text("(Conectado y cargando)");}else{$("#ajustes-dispositivo-acumulador-conectado").html("&#160;");}
			}
			break;
			case "ajustes-formulario-acerca" :
			if(tipoEvento === "collapsibleexpand"){
				$("#ajustes-programa-versiones-corta").text(programa.propiedades.versiones.corta);
				$("#ajustes-programa-versiones-cordova").html(((/android/i.test(dispositivo.propiedades.plataforma.nombre)) ? " y el  marco de desarrollo multiplataforma Apache Cordova&#8482; (versión " + dispositivo.propiedades.cordova + ")." : " y el  marco de desarrollo multiplataforma Apache Cordova&#8482; (versión " + dispositivo.propiedades.cordova + ")."));
				$("#ajustes-programa-nombre").text(programa.propiedades.nombre);
				$("#ajustes-programa-paquete").html("Id: " + programa.propiedades.paquete);
				$("#ajustes-programa-serie").html("Serie: " + programa.propiedades.serie);
				$("#ajustes-programa-versiones-tirada").html(programa.propiedades.tirada.capitalizarPrimeraLetra());
				$("#ajustes-dispositivo-plataforma").html(dispositivo.propiedades.plataforma.nombre);
				$("#ajustes-programa-versiones-larga").text(programa.propiedades.versiones.larga);
				$("#ajustes-programa-versiones-tipo").html(" - " + programa.propiedades.versiones.tipo);
				$("#ajustes-programa-versiones-guarismo").html("Compilación: " + programa.propiedades.versiones.compilado);
				$("#ajustes-copyright-anualidad-corriente").text(programa.fecha.sistema.aaaa);
			}
			break;
		}	

	},


	guardarCambios : function(formulario){
		var columna, valor;
		var desplegable_origen = formulario.replace("formulario", "desplegable");
		var guardarCambiosEnBD = false;
		switch(formulario){
			case "ajustes-formulario-marca" :
			columna = "marca";
			if($("#ajustes-marca-campo-oculto").val()=== "editar"){				
				valor = $.trim($("#ajustes-marca-entrada-texto").val());				
				if(valor === ""){
					programa.avisar("No has escrito ninguna marca para el reloj", 4000, "bottom");
					$("#ajustes-marca-entrada-texto").focus();	
				}else{
					valor = (valor.length > 18) ? valor.substring(0, 18) : valor;				
				} 	
			} else if($("#ajustes-marca-campo-oculto").val()=== "eliminar"){
				valor = "####################";				
			}
			guardarCambiosEnBD = true;
			break;
			case "ajustes-formulario-tema" :
			columna = "tema";
			valor = ($.inArray($("#ajustes-tema-campo-oculto").val(), ["bn", "ba", "nb", "nr"]) !== -1) ? $("#ajustes-tema-campo-oculto").val() : "bn";
			guardarCambiosEnBD = true;
			break;		
			case "ajustes-formulario-captura" :
			columna = "imagen";
			programa.capturaDePantalla.formato = $("input:radio[name=ajustes-captura-formato]:checked").val();
			programa.capturaDePantalla.calidad = $("input:radio[name=ajustes-captura-calidad]:checked").val();
			valor = programa.capturaDePantalla.formato + "|" + programa.capturaDePantalla.calidad;
			programa.capturaDePantalla.pendiente = true;
			programa.ventana.desplegable.colapsar("#ajustes-desplegable-captura");
			$("#ajustes-regresar").trigger("click");	
			break;	
			case "ajustes-formulario-actualizaciones":
			if($("#ajustes-actualizaciones-guardar-cambios").val().toLowerCase() === "comprobar"){
				programa.restaurarFormulario(formulario);
				programa.actualizaciones.comprobar.consulta();
			}else if($("#ajustes-actualizaciones-guardar-cambios").val().toLowerCase() === "descargar"){
				programa.actualizaciones.descargar.transferencia();
			}else if($("#ajustes-actualizaciones-guardar-cambios").val().toLowerCase() === "instalar"){
				programa.actualizaciones.instalar();
			}
			break;
		}
		if(guardarCambiosEnBD){
			if(dispositivo.baseDeDatos === null){
				if (columna === "marca"){
					programa.reloj.marca = (valor === "####################")? "" : valor ;
				}else if(columna === "tema"){
					programa.reloj.tema = valor;
				}
				programa.ventana.desplegable.colapsar("#" + desplegable_origen);
				programa.ventana.protector.activar("ajustes", true);
				programa.ventana.protector.desactivar("ajustes");
				$("#ajustes-regresar").trigger("click");
				programa.avisar("OK!", 4000);
			}else{
				programa.ventana.desplegable.colapsar("#" + desplegable_origen);
				programa.ventana.protector.activar("ajustes", true);
				dispositivo.modificarBaseDeDatos(columna, valor);	
			}
		}	
	},

	/**
	* capturaDePantalla - Obtiene una imagen del reloj que conserva en la 'galería de imágenes'
	* del dispositivo.
	* Necesita del complemento : 'com.darktalker.cordova.screenshot'.
	**/


	capturaDePantalla : {
		pendiente : false,
		enCurso:false,
		formato : "jpg",
		calidad : "50",
		
		preparar: function(){
			programa.capturaDePantalla.enCurso = true;	
			$("#captura-de-pantalla").popup( "close" );
			dispositivo.sonido.reproducir("clic");
		},

		procesar :function(){
			var mensajeError, demora, canvas, contexto, imagen, imagen_id;			
			try{
				canvas = document.getElementById("reloj");
				contexto = canvas.getContext("2d");
				imagen = new Image();
				imagen.id = "reloj_" + Math.round((+(new Date()) + Math.random()));
				imagen.src = canvas.toDataURL();
				$("#index-capa-central").center();
				$("#imagen-reloj").css({"width":programa.pantalla.longitudCapaCentral + "px","height": programa.pantalla.longitudCapaCentral + "px"});
				$("#imagen-reloj").prepend(imagen);
				$("#imagen-reloj").center();
			}catch(error){
				mensajeError = error;
			}finally{
				imagen_id = (imagen === undefined) ? "undefined" : imagen.id;
				if(mensajeError !== undefined){
					programa.capturaDePantalla.finalizar("procesar", mensajeError, imagen_id);
				}else{
					clearTimeout(demora);
					demora = setTimeout(function(){
						programa.capturaDePantalla.guardar(imagen_id);}, 1000);
				}
			}
		},

		guardar : function(identificadorImagen){
			if( dispositivo.disponible){	
				dispositivo.sonido.reproducir("obturador");
				navigator.screenshot.save(function(error,res){
					if(error){
						programa.capturaDePantalla.finalizar("guardar", error, identificadorImagen );
					}else{
						programa.capturaDePantalla.finalizar("guardar", "OK", identificadorImagen);
					}
				},programa.capturaDePantalla.formato, parseInt(programa.capturaDePantalla.calidad, 10),identificadorImagen);
			}else{
				programa.capturaDePantalla.finalizar("guardar", "Función no operativa ...", identificadorImagen );
			}
		},

		finalizar : function(funcionalidad, suceso, identificadorImagen){
			identificadorImagen = identificadorImagen || "undefined";
			if(funcionalidad === "guardar" && suceso === "OK"){
				programa.avisar("Captura de pantalla en tu galería de imágenes", 4000, "bottom");
			}else if(funcionalidad === "guardar" && suceso !== "OK") {
				programa.avisar("Captura de pantalla<br />No fue posible guardar la imagen<br />" + suceso, 4000, "bottom","#ff0000");
			}else{
				programa.avisar("Error en captura de pantalla ...<br />" + suceso, 4000, "bottom", "#ff0000");
			}
			if(identificadorImagen !== "undefined") $("#" + identificadorImagen).remove();
			$("#imagen-reloj").css({"top": "0px", "left": "0px","width":"0px","height":"0px"});
			programa.capturaDePantalla.enCurso = false;		
		}
	},
	 
	/**
	* actualizaciones - Sistema de actualizaciónes ('back-end') vía internet. 
	* *** Exclusivamente a modo de ejemplo: ***
	* Esta es una aplicación experimental fuera de los circuitos de distribución comerciales (Google Play Store, App Store, etc).
	* El código siguiente pretende, a petición del usuario:
	* 1) comprobar - Si existen versiones disponibles, superiores a la instalada. 
	* 2) descargar - El archivo (.apk, si Android) con la nueva versión, que guarda en el almacén
	*    temporal (público) de la aplicación corriente.
	*    Necesita de los complementos: 'cordova-plugin-file' y 'cordova-plugin-file-transfer'.
	* 3) instalar - el archivo descargado con la nueva versión. Necesita del
	*    complemento: 'com.borismus.webintent'.
	* 4) limpiar - Proceso automático de limpieza de los archivos residuales, descargados.	
	* **
	* Los paquetes con las nuevas versiones están almacenados en una sección de
    * un alojamiento web, con la siguiente estructura:
	* ---------------
	* 	http:// ... /download/cordova/
	*	index.php (1)				reloj/(2)
	*							    android/(3)
    *								es.foog.cordova.reloj/(4)
	*								0.1.1/	(5)				0.1.2/ (5)
	*								android-debug.apk (6)	android-debug.apk (6)
	*								android-release.apk (7)	android-release.apk (7)
    * -----------------
	* (1) - Archivo 'index.php',  Guión PHP que gestiona la petición del usuario que contiene
    *       los siguientes valores: versión actual, nombre , identificador
    *       (packageName), y serie de la aplicación; plataforma del dispositivo. Devuelve un objeto
    *       con notación JSON que indica si hay o no nuevas versiones disponibles, con la ruta de
    *       descarga, en caso afirmativo.	
	* (2) - Directorio con el nombre (alias) de la aplicación.
	* (3) - Directorio con el nombre de la plataforma correspondiente a la distribución.
    * (4) - Directorio con el mismo nombre que el identificador de la aplicación (packageName).
    * (5) - Directorio/s con el mismo nombre (numeral) que el de la versión que contienen.
	* (6) - Paquete de la aplicación, depuración.	
    * (7) - Paquete de la aplicación, con firma privada.
    * **
	* Consideraciones finales:
    * Si bien la 'comprobación' y 'descarga' no causa problemas, la instalación de la nueva
	* versión (vía webintent) se producirá sólo si:
	* - No hay conflicto entre las firmas de la aplicación corriente y la nueva.
    * - El paquete de la nueva versión se ha almacenado en 	un lugar 'no privado'
	*   del dispositivo, por ejemplo: 'externalCacheDirectory', en Android.
    * - El sistema operativo del dispositivo es de una versión igual o superior a la
    *   de la API mínima con la que se ha compilado la nueva aplicación.
    * También conviene (aunque creo innecesario en las últimas versiones Cordova) añadir al
    * archivo AndroidManifest.xml , las siguientes líneas:
    * <uses-permission android:name="android.permission.INSTALL_PACKAGES" />
    * <uses-permission android:name="android.permission.DELETE_PACKAGES" /> 	
    * ** Ver archivo doc/DOC.md, para más detalles. 
	**/

	 
	actualizaciones : {
	versiones : {nueva :"", rutaRemota : "", archivoNombre : "", peso : 0, pesoTexto: "", fecha : null, fechaTexto: ""},
	error : false,
	interfazConsulta : null,
	interfazTransferencia : null,
	repositorio : "http://your_web_domain/your_repository/",	
	
	rutaLocal : "",
	
	comprobar : {			
		enCurso : false,
		error : {num: "", mensaje : ""},
		
		consulta :function (){
			
			programa.actualizaciones.comprobar.enCurso = true;
			programa.ventana.protector.activar("ajustes"); 
			$("#ajustes-actualizaciones-tarea").html("Comprobando&#160;&#8230;");	
			$("#ajustes-actualizaciones-barra-progreso").val(0).slider("refresh");	
			programa.actualizaciones.comprobar.progreso(0,46,false);
			programa.actualizaciones.interfazConsulta = $.ajax({
			url : programa.actualizaciones.repositorio,
			dataType: "json",
			type : "POST",
			timeout: 10000,
			success: false,
			data: {
				
				nombre: programa.propiedades.nombre.toLowerCase(),
				versionesCorriente: programa.propiedades.versiones.larga,
				paquete: programa.propiedades.paquete,
				serie: programa.propiedades.serie,
				plataforma : dispositivo.propiedades.plataforma.nombre.toLowerCase()
				
				
				
			}
			})
			.done(function(){
				this.success = true;
			})
			.always(function(respuesta, estado){
				if(this.success && respuesta.acierto){
					if(respuesta.resultado){
						if(respuesta.estreno){
							programa.actualizaciones.versiones.nueva = respuesta.versiones.nueva;
							programa.actualizaciones.versiones.rutaRemota = respuesta.versiones.url;
							programa.actualizaciones.versiones.archivoNombre = programa.actualizaciones.versiones.rutaRemota.substring(programa.actualizaciones.versiones.rutaRemota.lastIndexOf("/")+1);
							if(respuesta.versiones.peso !== false && !isNaN(respuesta.versiones.peso)){
								programa.actualizaciones.versiones.peso = parseInt(respuesta.versiones.peso,10);
								programa.actualizaciones.versiones.pesoTexto = (programa.actualizaciones.versiones.peso >= 1000000) ? ((parseFloat(programa.actualizaciones.versiones.peso) / 1000000).toFixed(2) + " MB") : ((parseFloat(programa.actualizaciones.versiones.peso) / 1000).toFixed(2) + " KB"); 
							}
							if(respuesta.versiones.fecha !== false && !isNaN(respuesta.versiones.fecha)){
								programa.actualizaciones.versiones.fecha = parseInt(respuesta.versiones.fecha,10);
								programa.actualizaciones.versiones.fechaTexto = (new Date(programa.actualizaciones.versiones.fecha));
							}
						}
					}else{ 
						programa.actualizaciones.error = true; 
						programa.actualizaciones.comprobar.error.mensaje = respuesta.error;
						programa.actualizaciones.comprobar.error.num = (/^\d/.test(programa.actualizaciones.comprobar.error.mensaje)) ? "" : "503";					
					}
				}else{
					programa.actualizaciones.error = true; 
					if(respuesta.status === 0 && estado !== "timeout"){
						programa.actualizaciones.comprobar.error.num = "403";
						programa.actualizaciones.comprobar.error.mensaje = "Same origin policy";
					}else if(respuesta.status === 0 && estado === "timeout"){
						programa.actualizaciones.comprobar.error.num = "408";
						programa.actualizaciones.comprobar.error.mensaje = "Request timeout";
					}else{
						if(respuesta.status.toString() === "200"){
							programa.actualizaciones.comprobar.error.num = "500";
							programa.actualizaciones.comprobar.error.mensaje = "Internal server error";
							
						}else{
							programa.actualizaciones.comprobar.error.num = respuesta.status.toString();
							programa.actualizaciones.comprobar.error.mensaje = espuesta.statusText;
						} 
					} 
				}
				clearInterval(programa.actualizaciones.intervaloProgreso);
				programa.actualizaciones.comprobar.progreso(parseInt($("#ajustes-actualizaciones-barra-progreso").val(),10), 100, true);		
			});
		},
		
		intervaloProgreso : null,
		
		progreso: function (desde, hasta, finalizar){ //Progreso simulado.
			desde = (desde > 100) ? 100 : desde;
			hasta = (hasta > 100) ? 100 : hasta;
			finalizar = finalizar || false;
			var velocidad = (finalizar) ? 10 : 100;
			var contador = desde;
			if(!$("#ajustes-actualizaciones-botones").hasClass("ui-disabled")) $("#ajustes-actualizaciones-botones").addClass("ui-disabled");
			$("#ajustes-actualizaciones-barra-progreso").slider("enable");			
			$("#ajustes-actualizaciones-barra-progreso").val(contador).slider("refresh");
			$("#ajustes-actualizaciones-porcentaje-cifra").text(contador);
			$("#ajustes-actualizaciones-porcentaje").css ("visibility", "visible");
			programa.actualizaciones.intervaloProgreso = setInterval(function(){
				contador ++;
				if(contador >= hasta || contador >= 100){
					clearInterval(programa.actualizaciones.intervaloProgreso);
					programa.actualizaciones.intervaloProgreso = null;
					$("#ajustes-actualizaciones-barra-progreso").val(contador).slider("refresh");
					$("#ajustes-actualizaciones-porcentaje-cifra").text(contador);
					if(finalizar){ 
						if(!$("#ajustes-actualizaciones-porcentaje").hasClass("ui-disabled")) $("#ajustes-actualizaciones-porcentaje").addClass("ui-disabled") ;
						if($("#ajustes-actualizaciones-botones").hasClass("ui-disabled")) $("#ajustes-actualizaciones-botones").removeClass("ui-disabled");
						$("#ajustes-actualizaciones-barra-progreso").slider("disable");
						programa.actualizaciones.comprobar.finalizado();
					}
				}else{
					$("#ajustes-actualizaciones-barra-progreso").val(contador).slider("refresh");
					$("#ajustes-actualizaciones-porcentaje-cifra").text(contador);
				}
			}, velocidad);

		},

		finalizado : function() {
			var mensaje = ""; 
			var pulsador = "Comprobar";
			var error = "&#160;";
			if(!programa.actualizaciones.error){
				if(programa.actualizaciones.versiones.nueva !== "" && programa.actualizaciones.versiones.rutaRemota !== ""){
					mensaje = "<div>Hay una nueva versión de la aplicación disponible:</div><div>Reloj " + programa.actualizaciones.versiones.nueva + "</div><div>Si quieres, puedes &#171;<b>Descargar</b>&#187; ahora el paquete de instalación.</div>";
					pulsador = "Descargar";
				}else{
					mensaje = "<div>No hay nuevas versiones disponibles.</div><div>La aplicación Reloj " + programa.propiedades.versiones.larga + " está actualizada.</div>";
				}
			}else{
				mensaje = "<div>No se han encontrado nuevas versiones.</div>";
				error = "Error: " + programa.actualizaciones.comprobar.error.num + " - " + programa.actualizaciones.comprobar.error.mensaje;
			}
			programa.ventana.protector.desactivar("ajustes");
			programa.actualizaciones.error = false;
			$("#ajustes-actualizaciones-tarea").html("&#160;");
			$("#ajustes-actualizaciones-noticia").html(mensaje);
			$("#ajustes-actualizaciones-error").html(error);
			$("#ajustes-actualizaciones-guardar-cambios").val(pulsador).button("refresh");
			if(pulsador === "Comprobar") $("#ajustes-actualizaciones-guardar-cambios").button("disable");
			if(programa.actualizaciones.error) programa.actualizaciones.error = false;
			programa.actualizaciones.comprobar.enCurso = false;
			
		},
	}, // comprobar

	cancelar : function(){
		programa.ventana.protector.desactivar("ajustes");
		if(programa.actualizaciones.comprobar.enCurso || programa.actualizaciones.descargar.enCurso){
			if(programa.actualizaciones.comprobar.enCurso){
				programa.actualizaciones.interfazConsulta.abort();
				programa.actualizaciones.comprobar.enCurso = false;
			}
			if(programa.actualizaciones.descargar.enCurso){
				programa.actualizaciones.interfazTransferencia.abort();
				programa.actualizaciones.descargar.enCurso = false;
			}
			$("#ajustes-actualizaciones-error").append("<div>(Operation Cancelled)</div>");
		}else{
			programa.ventana.desplegable.colapsar("ajustes-desplegable-actualizaciones");
		}		
	},



	descargar :{
		
		enCurso: false,
		error : {num : "" , mensaje : ""},
		transferencia : function(){ 
			if(programa.actualizaciones.error) programa.actualizaciones.error = false;
			programa.actualizaciones.descargar.enCurso = true;
			programa.ventana.protector.activar("ajustes");
			$("#ajustes-actualizaciones-tarea").html("Descargando&#160;&#8230;");
			$("#ajustes-actualizaciones-barra-progreso").slider("enable");				
			$("#ajustes-actualizaciones-barra-progreso").val(0).slider("refresh");
			if(!$("#ajustes-actualizaciones-botones").hasClass("ui-disabled")) $("#ajustes-actualizaciones-botones").addClass("ui-disabled");
			$("#ajustes-actualizaciones-porcentaje-cifra").text("0");
			//$("#ajustes-actualizaciones-porcentaje").css ("visibility", "visible");
			if($("#ajustes-actualizaciones-porcentaje").hasClass("ui-disabled")) $("#ajustes-actualizaciones-porcentaje").removeClass("ui-disabled");
			$("#ajustes-actualizaciones-noticia").html("&#160;");
			$("#ajustes-actualizaciones-noticia1").html("&#160;");
			$("#ajustes-actualizaciones-noticia").html("<div>Archivo:</div><div><span>" + programa.actualizaciones.versiones.archivoNombre + "</span>" + ((programa.actualizaciones.versiones.peso !== false) ? "<span style='font-size:x-small;'>&#160;(" + programa.actualizaciones.versiones.pesoTexto +")</span><span>.&#160;Para Reloj&#160;" + programa.actualizaciones.versiones.nueva + "</span></div>" :  "<span>.&#160;Para Reloj&#160;" + programa.actualizaciones.versiones.nueva + "</span></div>"));

			//Sistema de ficheros:
			if(window.requestFileSystem){
				programa.actualizaciones.interfazTransferencia = new FileTransfer();
				if(programa.actualizaciones.interfazTransferencia !== null){				
					programa.actualizaciones.interfazTransferencia.download(
						encodeURI(programa.actualizaciones.versiones.rutaRemota),
						cordova.file.externalCacheDirectory + programa.actualizaciones.versiones.archivoNombre,
						function(entrada) {	
							programa.actualizaciones.error = false;
							$("#ajustes-actualizaciones-barra-progreso").val(100).slider("refresh");
							$("#ajustes-actualizaciones-porcentaje-cifra").text("100");	
							$("#ajustes-actualizaciones-tarea").html("Verificando&#160;&#8230;");
							//Verificando:
							if(entrada.isFile){
								entrada.file(function(file) {
								if(file.name !== undefined) dispositivo.modificarBaseDeDatos("limpieza", file.name.toString());
								if(!isNaN(file.size) && parseInt(file.size, 10) !== programa.actualizaciones.versiones.peso){
									programa.actualizaciones.error = true;	
								}
								});
							}else{
								programa.actualizaciones.error = true;	
							}
							programa.actualizaciones.rutaLocal = entrada.toURL;
							var espera;
							clearTimeout(espera);
							espera = setTimeout(function(){
								programa.actualizaciones.descargar.finalizado();
							}, 1000);
						},
						
						function(error) {							
							programa.actualizaciones.error = true;
							programa.actualizaciones.descargar.error.num = (error.code !== undefined) ? error.code : "";
							switch(programa.actualizaciones.descargar.error.num.toString()){
								case "1":
								programa.actualizaciones.descargar.error.mensaje = "File not found"; 
								break;
								case "2":
								programa.actualizaciones.descargar.error.mensaje = "Invalid URL"; 
								break;
								case "3":
								programa.actualizaciones.descargar.error.mensaje = "Connection fails"; 
								break;
								case "4":
								programa.actualizaciones.descargar.error.mensaje = "Abort"; 
								break;
								case "5":
								programa.actualizaciones.descargar.error.mensaje = "Not modified"; 
								break;
								default:
								programa.actualizaciones.descargar.error.mensaje = "Undefined"; 
								break;
							}
							programa.actualizaciones.descargar.finalizado();						
						}
					);
					
					programa.actualizaciones.interfazTransferencia.onprogress = function(progressEvent) {
						if (progressEvent.lengthComputable) {
							var porcentaje = Math.floor(progressEvent.loaded / progressEvent.total * 100);
							$("#ajustes-actualizaciones-barra-progreso").val(porcentaje).slider("refresh");
							$("#ajustes-actualizaciones-porcentaje-cifra").text(porcentaje);
						} 
					};				

					}else{	
						programa.actualizaciones.error = true;				
						programa.actualizaciones.descargar.error.num = "400";
						programa.actualizaciones.descargar.error.mensaje = "Bad request";
						programa.actualizaciones.descargar.finalizado();
					}
			}else{
				programa.actualizaciones.error = true;
				programa.actualizaciones.descargar.error.num = "4";
				programa.actualizaciones.descargar.error.mensaje = "Invalid state";
				programa.avisar("Función no operativa", 4000);
				programa.actualizaciones.descargar.finalizado();			
			}
			
		},		

		finalizado : function(){
			programa.actualizaciones.descargar.enCurso = false;
			var mensaje = ""; 
			var pulsador = "Descargar";
			var error = "&#160;";
			programa.ventana.protector.desactivar("ajustes");
			$("#ajustes-actualizaciones-tarea").html("&#160;");
			$("#ajustes-actualizaciones-barra-progreso").slider("disable");	
			if(!$("#ajustes-actualizaciones-porcentaje").hasClass("ui-disabled")) $("#ajustes-actualizaciones-porcentaje").addClass("ui-disabled") ;
			if($("#ajustes-actualizaciones-botones").hasClass("ui-disabled")) $("#ajustes-actualizaciones-botones").removeClass("ui-disabled");
			
			if(!programa.actualizaciones.error){
				mensaje = "<div>Descarga completa.</div><div>Si quieres, puedes &#171;<b>Instalar</b>&#187; ahora la nueva versión.</div>";
				$("#ajustes-actualizaciones-guardar-cambios").button("enable");
				pulsador = "Instalar";
			}else{
				$("#ajustes-actualizaciones-guardar-cambios").button("disable");
				var descargado = parseInt($("#ajustes-actualizaciones-barra-progreso").val(),10);
				if(descargado === 0 || isNaN(descargado)){
					mensaje = "<div>No ha sido posible descargar el archivo.</div>";	
				}else if(descargado > 0 && descargado < 100){					
					mensaje = "<div>Descarga incompleta.</div>";
				}else{
					mensaje = "<div>No superó la prueba de verificación.</div>";
				}
				error = "Error: " + programa.actualizaciones.descargar.error.num + " - " + programa.actualizaciones.descargar.error.mensaje;
				if(programa.actualizaciones.error) programa.actualizaciones.error= false;
			} 
			$("#ajustes-actualizaciones-noticia1").html("&#160;");
			$("#ajustes-actualizaciones-noticia1").html(mensaje);
			$("#ajustes-actualizaciones-error").html(error);
			$("#ajustes-actualizaciones-guardar-cambios").val(pulsador).button("refresh"); 
		},
		
	},

	limpiar : function(archivoResidual){
	
		var manejarError = function(error){
			var mensaje = "";
			switch (error.code) {
				case FileError.QUOTA_EXCEEDED_ERR:
				mensaje = "QUOTA EXCEEDED";
				break;
				case FileError.NOT_FOUND_ERR:
				mensaje = "FILE NOT FOUND";
				break;
				case FileError.SECURITY_ERR:
				mensaje = "SECURITY ERR";
				break;
				case FileError.INVALID_MODIFICATION_ERR:
				mensaje = "INVALID MODIFICATION";
				break;
				case FileError.INVALID_STATE_ERR:
				mensaje = "INVALID STATE";
				break;
				default:
				mensaje = "Unknown";
				break;
			}
			programa.avisar("Limpieza de archivos residuales:<br />Error - " + mensaje, 4000);
			dispositivo.modificarBaseDeDatos("limpieza", "x.xxx");
		};

			window.resolveLocalFileSystemURL(cordova.file.externalCacheDirectory, function (sistemaArchivos) {
			sistemaArchivos.getFile(archivoResidual, {create: false}, function(entrada){
			entrada.remove(function(){
				programa.avisar("Limpieza de archivos residuales: Completa.", 4000);
				dispositivo.modificarBaseDeDatos("limpieza", "x.xxx");
			}, manejarError);
			}, manejarError);
			}, manejarError);
	},

	instalar : function(){
	
		window.plugins.webintent.startActivity({
			action: window.plugins.webintent.ACTION_VIEW,
			url: cordova.file.externalCacheDirectory + programa.actualizaciones.versiones.archivoNombre,
			type: "application/vnd.android.package-archive"
		},
		function() {},
		function(error) {
			$("#ajustes-actualizaciones-noticia1").html("&#160;");
			$("#ajustes-actualizaciones-noticia1").html("<div>No ha sido posible abrir el paquete de instalación.</div>");
			$("#ajustes-actualizaciones-error").html("Error: Failed to open file via 'Android Intent'");
			$("#ajustes-actualizaciones-guardar-cambios").button("disable");
			programa.actualizaciones.limpiar(programa.actualizaciones.versiones.archivoNombre);
			});
			
		}
	}, //Cierre acutalizaciones
};  // Fin objeto 'programa'



var dispositivo = {	

	/**
	 * dispositivo.disponibe - Es 'true' cuando se consigue el evento 'deviceready'.
	 **/

	disponible : false,

	propiedades : {
			cordova : "cordova",
			plataforma : {
			nombre : "sistema",
			versiones : "versión",
		},
		uuid : "uuid",
		tipo : "dispositivo",
		modelo : "modelo",
		dimensiones : screen.width + " &#215; " + screen.height + " píxeles",
		ratio: (window.devicePixelRatio !== undefined || window.devicePixelRatio !== "") ? (parseFloat(window.devicePixelRatio).toFixed(2)).toString() : "?",
	},
	
	/**
	 * acumulador - Control del estado de la batería del dispositivo.
	 * Necesita el complemento : 'cordova-plugin-battery-status'.
	 **/

	acumulador : { 
		nivel : "",
		conectado : false,
		examinar : function (estado){
			dispositivo.acumulador.nivel = estado.level;
			dispositivo.acumulador.conectado = estado.isPlugged; 
		}
	},
	
	/**
	 * obtenerEstadoDeRed - Función que determina el estado de la conexión a internet.
	 * Necesita el complemento : 'cordova-plugin-network-information'.
	 **/

	obtenerEstadoDeRed : function(){
		var conectado = [false, "Ninguna"], tipoRed = "Ninguna", 
		examinarRed = function(){
			var tipo = navigator.connection.type;
			var estados = {};
			estados[Connection.UNKNOWN]  = "Desconocida";
			estados[Connection.ETHERNET] = "Ethernet";
			estados[Connection.WIFI]     = "WiFi";
			estados[Connection.CELL_2G]  = "2G";
			estados[Connection.CELL_3G]  = "3G";
			estados[Connection.CELL_4G]  = "4G";
			estados[Connection.CELL]     = "Teléfono";
			estados[Connection.NONE]     = "Ninguna";
			return estados[tipo];
		};
		if(("connection" in navigator)){
			tipoRed = examinarRed(); 
			conectado[0] = (tipoRed === "Ninguna") ? false : true;
			conectado[1] =  tipoRed;
		}else{
			if(navigator.onLine){
				conectado[0] = true;
				conectado[1] = "Desconocida";
			}
		}
		return conectado;
	},
	/**
	 * preparado - Acciones y escucha de eventos especiales relacionados con los 'plugins'
	 * nativos y opcionales, añadidos. Esta función se ejecuta una vez desencadenado el evento 'deviceready'.
	 **/

	preparado: function(){
		
		/* La pantalla de presentación se consigue con el complemento: 'cordova-plugin-splashscreen'.
		 * Su configuración de establece en el archivo 'config.xml', así:
		 * ...
		 * <preference name="SplashScreen" value="screen" />
	     * <preference name="SplashScreenDelay" value="3000" />
         * <preference name="SplashMaintainAspectRatio" value="true" />
	     * ...
		 **/
		
		/* cordova nativo - Eventos del 'ciclo de vida': */
		document.addEventListener("backbutton", dispositivo.escucharTeclaRetorno, false); 
		// Apache Cordova ha suprimido la programación del evento 'menubutton' en las últimas versiones.
		document.addEventListener("menubutton", dispositivo.escucharTeclaOpciones, false);
		document.addEventListener("pause", programa.pausar, false);
		document.addEventListener("resume", programa.reanudar, false);
		
		/* Con el Complemento: 'cordova-plugin-battery-status' */
		window.addEventListener("batterystatus", dispositivo.acumulador.examinar, false);
		
		/* Con el Complemento: 'ionic-plugin-keyboard' */
		window.addEventListener("native.keyboardshow", programa.teclado.seAbre);
		window.addEventListener("native.keyboardhide", programa.teclado.seCierra);		
		
		/* Con el Complemento: 'uk.co.whiteoctober.cordova.appversion' */
		cordova.getAppVersion.getAppName(function(valor){programa.propiedades.nombre = valor;});		
		cordova.getAppVersion.getVersionNumber(function(valor){
			programa.propiedades.versiones.larga = valor;
			var entregaCorta = valor.split("."); 
			programa.propiedades.versiones.corta = (entregaCorta.length > 1) ? entregaCorta[0] + "." + entregaCorta[1] : entregaCorta;
		});
		cordova.getAppVersion.getVersionCode(function(valor){programa.propiedades.versiones.compilado = valor;});
		cordova.getAppVersion.getPackageName(function(valor){programa.propiedades.paquete = valor;});
		
		/* Con el Complemento: 'cordova-plugin-device' */
		programa.propiedades.plataforma = device.platform;
		dispositivo.propiedades.cordova = device.cordova;
		dispositivo.propiedades.plataforma.nombre = device.platform;
		dispositivo.propiedades.plataforma.versiones = device.version;
		dispositivo.propiedades.uuid = device.uuid;
		dispositivo.propiedades.modelo = device.model;
		
		/* Con el Complemento: 'uk.co.workingedge.phonegap.plugin.istablet' */
		dispositivo.propiedades.tipo =  window.isTablet ? "Tablet" : "Smartphone";
		
		/* Precarga de los archivos de sonido en la memoria del dispositivo. Complemento : 'cordova-plugin-nativeaudio' */
		dispositivo.sonido.id.forEach(function(identificador){dispositivo.sonido.cargar(identificador);});
		
		/* Con el Complemento: 'io.litehelpers.cordova.sqlite' */
		dispositivo.abrirBaseDeDatos();	
		dispositivo.leerBaseDeDatos(true);
		
		dispositivo.disponible = true;
	},	
	
	/**
	 * escucharTeclaRetorno y escucharTeclaOpciones - Funciones asociadas a los eventos (cordova - nativos)
	 * 'backbutton' y 'menubutton'(1) respectivamente.
	 * (1) : Apache CORDOVA ha suprimido la programación del evento 'menubutton', en las últimas versiones
	 * de la Cordova-CLI; puedes ver discusión y propuesta de 'parche' aquí:
	 * https://issues.apache.org/jira/browse/CB-8921
	 * Si decides, como yo, aplicar el 'parche' para conservar la funcionalidad del botón menú en los dispositivos que aún
	 * disponen de él. Sigue los pasos del anuncio de 'Sven Casimir' - 06/Nov/15 11:03. Considerando (hay una errata de
	 * redacción) : Donde dice:
	 * Finally in CordovaLib/src/org/apache/cordova/CoreAndroid.java line 357
	 * debe decir:
     * Finally in CordovaLib/src/org/apache/cordova/CordovaWebImpl.java line 357	 
	 **/

	escucharTeclaRetorno : function(evento){
		evento.preventDefault();
		if(programa.ventana.protector.desplegado) return;
		switch(programa.ventana.hoja.id){
			case "index" :
			if(programa.ventana.panel.abierto) {
				$( "#opciones" ).panel( "close" );				
			}else{
				if(programa.ventana.emergente.id !== "" ){				
					$("#" + programa.ventana.emergente.id).popup( "close" );
				}else{
					programa.ventana.emergente.abrir("#salida");	
				}			
			} 
			break;
			case "ajustes" :
			$("#ajustes-regresar").trigger("click");
			break;
			case "licencia" :
			$("#licencia-regresar").trigger("click");
			break;
			case "calendario":
			$("#calendario-regresar").trigger("click");
			break;
		}
	},

	escucharTeclaOpciones : function(evento){		
		evento.preventDefault();			
		if(programa.ventana.hoja.id === "index"){
			if(programa.ventana.emergente.id === ""){
				if(programa.ventana.panel.abierto) {
					$( "#opciones" ).panel( "close" );				
				}else{
					$( "#opciones" ).panel( "open" );
				}
			}else{
				
				switch(programa.ventana.emergente.id){
					case "bienvenida" :
					$("#bienvenida").popup("close");
					$("#opciones" ).panel( "open" );
					break;
					case "captura-de-pantalla":
					$("#captura-de-pantalla-cerrar").focus();				
					break;				
					case "salida" :
					programa.ventana.emergente.oscilar("#salida");
					break;
				}				
			}			
		}
		
	},
	
	/**
	 * sonido - Acciones para la precarga, reproducción y remoción de archivos locales de
	 * sonido con formato .mp3.
	 * Necesita del complemento : 'cordova-plugin-nativeaudio'.
	 **/
	
	sonido : {
		id : ["clic", "obturador", "tictac"],
		activo :[], // id del archivo, activos.
		tictac : false,

		cargar : function(id){
			var modo = (id === "tictac") ? "complex" : "simple";		
			var ruta = "mp3/" + id + ".mp3";
			if(modo === "complex"){
				window.plugins.NativeAudio.preloadComplex( id, ruta, 1, 1, 0, function(mensaje){if(dispositivo.sonido.activo.indexOf(id) === -1) dispositivo.sonido.activo.push(id);}, function(mensaje){programa.avisar("Sonido Error:<br />" + "(" + id + ".mp3)<br />" + mensaje, 4000);});
			}else{
				window.plugins.NativeAudio.preloadSimple( id, ruta, function(mensaje){if(dispositivo.sonido.activo.indexOf(id) === -1) dispositivo.sonido.activo.push(id);}, function(mensaje){programa.avisar("Sonido Error:<br />" + "(" + id + ".mp3)<br />" + mensaje, 4000);});
			}
		},

		reproducir : function(id){
			if(dispositivo.sonido.activo.indexOf(id) === -1) dispositivo.sonido.cargar(id);
			if(id === "tictac"){
				window.plugins.NativeAudio.loop("tictac");
				dispositivo.sonido.tictac = true;
			}else{
				window.plugins.NativeAudio.play(id);
			}
		},

		detener : function(id){
			if(id === "tictac") dispositivo.sonido.tictac = false;
			window.plugins.NativeAudio.stop(id);
		},	
		
		remover : function(id){
			if(id === "tictac") dispositivo.sonido.tictac = false;
			window.plugins.NativeAudio.unload(id);
			dispositivo.sonido.activo.splice(dispositivo.sonido.activo.indexOf(id),1);
		},	
	},
	
	/**
	 * baseDeDatos - Abrir, leer y modificar la base de datos local (SQLite) 'reloj.db'. Archivo
	 * situado en el directorio raíz de la aplicación.
	 * Necesita el complemento : 'io.litehelpers.cordova.sqlite'.
	 **/

	baseDeDatos : null,

	abrirBaseDeDatos : function(){		
		if(window.sqlitePlugin){
		dispositivo.baseDeDatos = window.sqlitePlugin.openDatabase({name:"reloj.db", createFromLocation: 1});
		}		
	},

	leerBaseDeDatos : function(primeraLectura){
		primeraLectura = primeraLectura || false;
		if(dispositivo.baseDeDatos !== null){
			dispositivo.baseDeDatos.transaction(function(tarea){
			tarea.executeSql("SELECT marca, tema, sonido, imagen, limpieza, versiones FROM ajustes WHERE id = 1;", [], obtenerValores, dispositivo.detectarBaseDeDatosErrorLectura);
			});
			var obtenerValores = function(tarea, resultados){
				programa.reloj.marca = (resultados.rows.item(0).marca === "####################") ? "" : resultados.rows.item(0).marca;
				programa.reloj.tema =  resultados.rows.item(0).tema;
				
				if(primeraLectura){
					if(resultados.rows.item(0).limpieza !== "x.xxx") programa.actualizaciones.limpiar(resultados.rows.item(0).limpieza);
					if(resultados.rows.item(0).versiones < programa.propiedades.versiones.larga){
							dispositivo.modificarBaseDeDatos("versiones", programa.propiedades.versiones.larga);
					}
				}
					
			};
		}
	},

	modificarBaseDeDatos : function(columna,valor){
		if (columna === "marca"){
			valor = (valor !== "####################" && valor.length > 18) ? valor.substring(0, 18) : valor;	
		}
		var actualizarAjustes = function(tarea){
			dispositivo.leerBaseDeDatos(false);
			if(columna === "marca" || columna === "tema"){
				var retrasoRegreso;
				clearTimeout(retrasoRegreso);
				retrasoRegreso = setTimeout(function(){
					programa.ventana.protector.desactivar("ajustes");
					$("#ajustes-regresar").trigger("click");
					dispositivo.sonido.reproducir("clic");
				}, 2000);							
			}
			if(columna === "versiones") programa.ventana.emergente.abrir("#bienvenida"); 
		};	
		if(dispositivo.baseDeDatos !== null){			
			dispositivo.baseDeDatos.transaction(function(tarea) {tarea.executeSql("UPDATE ajustes SET " + columna + "='" + valor + "' WHERE id = 1;", [],actualizarAjustes,dispositivo.detectarBaseDeDatosErrorEscritura);});
		}
	},	

	detectarBaseDeDatosErrorLectura : function(tarea, error) {
		programa.avisar("Se ha producido un error de lectura en la base de datos de la aplicación", 4000, "bottom","#ff0000");
		if(programa.ventana.hoja.id === "ajustes"){
			var retrasoRegreso;
			clearTimeout(retrasoRegreso);
			retrasoRegreso = setTimeout(function(){
				programa.ventana.protector.desactivar("ajustes");
				$("#ajustes-regresar").trigger("click");					
			}, 2000);
		}
	}, 	

	detectarBaseDeDatosErrorEscritura : function(tarea, error) {
		programa.avisar("Se ha producido un error de escritura en la base de datos de la aplicación", 4000, "bottom", "#ff0000");
		if(programa.ventana.hoja.id === "ajustes"){
			var retrasoRegreso;
			clearTimeout(retrasoRegreso);
			retrasoRegreso = setTimeout(function(){
				programa.ventana.protector.desactivar("ajustes");
				$("#ajustes-regresar").trigger("click");					
			}, 500);
		}
	}, 	

}; 


$(document).on("pagecreate","#index",function(evento){	
	
	/* Inicio. */
	
	$("#index-capa-central").css("width", programa.pantalla.longitudCapaCentral + "px").css("height", programa.pantalla.longitudCapaCentral + "px");
	$("#index-capa-central").center();
	$("#reloj").css("width", programa.pantalla.longitudCapaCentral + "px").css("height", programa.pantalla.longitudCapaCentral + "px");
	document.getElementsByTagName("canvas")[0].width  = programa.pantalla.longitudCapaCentral;
	document.getElementsByTagName("canvas")[0].height = programa.pantalla.longitudCapaCentral;
	$("#ajustes-capa-central").css("width", programa.pantalla.longitudCapaCentral + "px").css("max-width", programa.pantalla.longitudCapaCentral + "px");
	$("#captura-de-pantalla, #salida, #acerca-de, #bienvenida").css("min-width", programa.pantalla.longitudCapaCentral - 72 + "px");
	$("#captura-de-pantalla, #salida, #acerca-de, #bienvenida").css("max-width", programa.pantalla.longitudCapaCentral + "px");
	programa.fecha.sistema = new programa.fecha.elaborar();
	programa.reloj.accionar();
	programa.propiedades.leerXML();
	
	/**
	 * Eventos:
	 **/
	 
	 /* Eventos generales: Orientación del dispositivo y 'clic' (sobre el reloj) para acceso al menú */
	 
	$( window ).on( "orientationchange", function(evento){
		evento.preventDefault();
		if(programa.ventana.panel.abierto) $( "#opciones" ).panel( "close" );
		if(programa.ventana.emergente.id !== "") $("#" + programa.ventana.emergente.id).popup("close");
		programa.pantalla.centrarReloj(); 	
	});

	$("#index-capa-central").click(function(evento) {
		evento.preventDefault();
		$("#opciones" ).panel( "open" );		
	});
	
	/* Eventos - página : */
	
	$(document).on("pagecontainerbeforehide", function() {
		if(programa.ventana.hoja.id === "ajustes"){
			$("#ajustes-conjunto-desplegable").children().collapsible("collapse");
		}
	});

	$(document).on("pagecontainerbeforeshow", function(evento, datos) {
		programa.ventana.hoja.id = datos.toPage[0].id;
		switch(programa.ventana.hoja.id){
			case "index" :
			programa.pantalla.coordenadaSuperior =  $("#index").offset().top;
			//programa.pantalla.centrarReloj(); // Probar
			break;
			case "ajustes":
			$("#ajustes-ocultable-versiones-corta").text(programa.propiedades.versiones.corta);
			break;
			case "licencia" :
			$("#licencia-programa-versiones-corta").text(programa.propiedades.versiones.corta);
			$(".licencia-copyright-anualidad-corriente").text(programa.fecha.sistema.aaaa);
			break;
			case "calendario" :
			programa.fecha.calendario.presentar();
			break;
		}
	});
	
	$(document).on("pagecontainershow", function(evento, datos) {
		switch(programa.ventana.hoja.id){
			case "index":
			
			if(programa.pantalla.coordenadaSuperior !== null) {
				$.mobile.silentScroll(programa.pantalla.coordenadaSuperior);
			}
			programa.pantalla.centrarReloj(); 
			if(programa.capturaDePantalla.pendiente){
				programa.capturaDePantalla.pendiente = false;			
				programa.ventana.emergente.abrir("#captura-de-pantalla");					
			}	
			break;	
			case "ajustes" : 
			if(!$("#ajustes-pie").is(":visible")) $("#ajustes-pie").show(); 
			var desplegableSolicitado = "";
			if(programa.ventana.desplegable.solicitado !== ""){
				programa.ventana.desplegable.expandir(programa.ventana.desplegable.solicitado);
			} 
			break;
		}
	});
		
	
	/* Eventos - panel : */
	
	document.addEventListener('touchmove', function (evento) {
		/* La propagación del evento queda anulada si se precisa de las funciones de 'iScroll.js' */
		if(programa.ventana.panel.desplazamiento !== null) evento.preventDefault(); 	
	}, false);
	
	
	$("#opciones" ).on( "panelbeforeopen", function( evento, datos ) {
		$(".ui-panel").css("max-width", parseInt($(window).width() * 0.90, 10) + "px");
		programa.ventana.panel.situarBotones(evento.type);
	});
	
	$( "#opciones").on( "panelopen", function( evento, datos ) {
		programa.ventana.panel.abierto = true;
	}).on ("panelclose", function( evento, datos ) {
		evento.preventDefault();
		programa.ventana.panel.abierto = false;
		programa.ventana.panel.situarBotones(evento.type);		
	});
	
	/* Eventos - popup : */

	$("#salida, #bienvenida").on( "popupbeforeposition", function() {
		if(this.id === "salida") $("#salida-versiones").text (programa.propiedades.versiones.larga);
		if(this.id === "bienvenida"){
			$("#bienvenida-versiones").text (programa.propiedades.versiones.larga);
			$("#bienvenida-anualidad").text (programa.fecha.sistema.aaaa);
		}		
	});
	
	$( "#salida, #captura-de-pantalla, #bienvenida").on( "popupafteropen", function() {		
		programa.ventana.emergente.id = this.id;
	}).on ("popupafterclose", function() {
		if(this.id === "captura-de-pantalla" && programa.capturaDePantalla.enCurso){
			programa.capturaDePantalla.procesar();		
		}
		programa.ventana.emergente.id = "";		
	});
	
	/* Eventos - del conjunto 'desplegable' en la página 'ajustes' */
	
	$("#ajustes-conjunto-desplegable").children().on( "collapsiblecollapse", function( evento, datos ) {		
		if(programa.ventana.desplegable.inicializado) $.mobile.silentScroll(0);		
		if( this.id !== "ajustes-desplegable-calendario" && programa.ventana.desplegable.inicializado){
			var formulario = this.id.replace("desplegable", "formulario");	
			programa.restaurarFormulario(this.id, evento.type);			
		}
	});


	$("#ajustes-conjunto-desplegable").children().on( "collapsibleexpand", function( evento, datos ) {
		if(!programa.ventana.desplegable.inicializado) programa.ventana.desplegable.inicializado = true;
		if(this.id === "ajustes-desplegable-calendario") $("#ajustes-calendario-hoy").text(programa.fecha.sistema.dsemana.capitalizarPrimeraLetra() + "," + programa.fecha.sistema.d + " de " + programa.fecha.sistema.mes + " de " + programa.fecha.sistema.aaaa);
		var formulario = this.id.replace("desplegable", "formulario");
		programa.restaurarFormulario(formulario,evento.type);
		//if (programa.ventana.desplegable.solicitado !== ""){
			$("html, body").animate({scrollTop : $(this).offset().top - 54});	
		//}		
		programa.ventana.desplegable.solicitado = "";
	});

	/* Eventos - Cambios en los elementos interactivos de los 'formularios' : */	
	
	$(document).on("change", "#ajustes-marca-alternativa-editar", function(){ 
		$("#ajustes-marca-campo-oculto").val("editar");
		$("#ajustes-marca-entrada-texto").textinput("enable");
		$("#ajustes-marca-entrada-texto").val("");
		$("#ajustes-marca-entrada-texto").focus();
		$("#ajustes-marca-advertencia").html("<span style='color:#FFFFFF;'>(Máximo dieciocho caracteres)</span>");
		if($("#ajustes-marca-guardar-cambios").is(":disabled")) $("#ajustes-marca-guardar-cambios").button("enable");
	}); 
	
	$(document).on("change", "#ajustes-marca-alternativa-eliminar", function(){ 
		$("#ajustes-marca-campo-oculto").val("eliminar");
		$("#ajustes-marca-entrada-texto").val("");
		$("#ajustes-marca-entrada-texto").textinput("disable");
		$("#ajustes-marca-advertencia").html("Guardar cambios&#160;&#8594;&#160;Eliminará la marca actual del reloj");
		if($("#ajustes-marca-guardar-cambios").is(":disabled")) $("#ajustes-marca-guardar-cambios").button("enable");
	});  

	$(document).on("change", "input:radio[name=ajustes-temas]", function(){
		$("#ajustes-tema-campo-oculto").val($("input:radio[name=ajustes-temas]:checked").val());
		if($("#ajustes-tema-guardar-cambios").is(":disabled")) $("#ajustes-tema-guardar-cambios").button("enable");
	});

	$(document).on("change", "input:radio[name=ajustes-captura-formato], input:radio[name=ajustes-captura-calidad]", function(){
		if($("#ajustes-captura-guardar-cambios").is(":disabled")){
			$("#ajustes-captura-guardar-cambios").button("enable");
			$("#ajustes-captura-advertencia").css("color","#FFF");
		}
	});	

	$("#ajustes-sonido-tictac").on("change", function(){
		if($("#ajustes-sonido-tictac").val() === "on"){
			$("#ajustes-sonido-advertencia").css("color","#FFF");
			if(!dispositivo.sonido.tictac){
				if(window.plugins && window.plugins.NativeAudio){
					dispositivo.sonido.reproducir("tictac");
				}else{
					dispositivo.sonido.tictac = false;
					programa.avisar("Función no operativa", 3000, "bottom");
				}	
			}	
		}else{
			$("#ajustes-sonido-advertencia").css("color","#696969");
			if(dispositivo.sonido.tictac){ 
				if(window.plugins && window.plugins.NativeAudio){
					dispositivo.sonido.detener("tictac");
				}else{
					dispositivo.sonido.tictac = false;
					programa.avisar("Función no operativa", 3000, "bottom");	
				}
			}
		}
	});

	$("#ajustes-actualizaciones-cancelar").click(function(){
	programa.actualizaciones.cancelar();
	});
	
	/* Evento 'deviceready' - Cordova nativo y con el complemento: 'cordova-plugin-device' */		
	document.addEventListener("deviceready", dispositivo.preparado, false);	
		
	});






