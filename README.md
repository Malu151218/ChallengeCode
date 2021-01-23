# CHALLENGE CODE - FINAL TP ACADEMIA GUAYERD!!!

BACKEND TV_SERIES

Crear un servidor que nos permita registrar las peticiones a la API y guardar las
respuestas de TVMaze.
Utilizar NodeJS/MongoDB
Crear un servicio GET "/search/shows" propio.
Tomar el texto a buscar y realizar DESDE EL BACKEND un request a TVMAZE.
Devolver al frontend la respuesta de TVMaze.
Cada vez que el frontend realiza una petición, registrar en una colección de
Mongo "requestLogs": fecha, texto de busqueda , IP (Si es posible)
Entregar un repo github con el código

BONUS! (Opcional)

Vamos a transformar nuestro backend en un servidor Proxy para implementar una Cache de
respuestas.
Guardar las respuestas de TVMaze en una colección de Mongo "seriesApiResponses"
(El objeto entero).
Cuando recibamos un nuevo request desde el frontend, revisar primero si podemos
responder desde nuestro Mongo. Si tenemos una respuesta posible, enviar ese
objeto al frontend. Si no la tenemos, realizar el request a TVMaze.
En la colección "requestLogs", agregar un atributo al objeto "responseFrom" con
dos opciones "CACHE|API", completar segun corresponda.
