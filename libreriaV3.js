console.log('libreria version 3.0')
var tagItems = document.querySelectorAll('[data-tag]')
var key = 'tagLibrary'
var dataLayer = window.dataLayer || [];


function click(data) {

    var data_to_session = {
        categoria: data.categoria,
        dataLibrary_name: data.nombre,
        dataLibrary_location: data.ubicacion,
        accion: data.accion,
        etiqueta: data.etiqueta || null
    }
    dataLayer.push(data_to_session)
    ga('send', 'event', data.categoria, data.categoria + "_" + data.accion, data.nombre, {
        'dimension73': data.categoria, 
        'dimension68': data.nombre,
        'dimension79': data.ubicacion,
        'dimension69': data.accion,
        'dimension70': data.etiqueta || null
    })
        
    return data_to_session;
}



function url() {
    var urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams) {

        var categoria = urlSearchParams.get('categoria')
        var nombre = urlSearchParams.get('nombre')
        var ubicacion = urlSearchParams.get('ubicacion')
        var etiqueta = urlSearchParams.get('etiqueta')
        var accion = urlSearchParams.get('accion')

        // data-destino="https://ww2.movistar.cl/empresas/cyber?cyber_source=home_B2B&cyber_medium=banner&cyber_campaign=cyber_mayo_2022"


        if(categoria != null && nombre != null && ubicacion != null && accion != null){
            var urlData = {
                categoria: categoria,
                dataLibrary_name: nombre,
                dataLibrary_location: ubicacion,
                accion: accion,
                etiqueta: etiqueta || null
            }
            dataLayer.push(urlData)
            ga('send', 'event', data.categoria, data.categoria + "_" + data.accion, data.nombre, {
                'dimension73': data.categoria,
                'dimension68': data.nombre,
                'dimension79': data.ubicacion,
                'dimension69': data.accion,
                'dimension70': data.etiqueta || null
            })
            
            saveSessionStorage(urlData)
            return urlData
        }
    }
}



//funcion para guardar datos en el sessionStorage
function saveSessionStorage(data) {
    var sessionData = sessionStorage.getItem(key)
    if (sessionData === null) {
        sessionStorage.setItem(key, JSON.stringify([data]))
    } else {
        // pushear objetos en un array
        var valuesTag
        valuesTag = JSON.parse(sessionStorage.getItem(key))
        valuesTag.push(data)
        sessionStorage.setItem(key, JSON.stringify(valuesTag))
    }
}

function sendSessionStorage(categoria, nombre) {
    var librarySession = sessionStorage.getItem(key)
    var libreria = [];

    JSON.parse(librarySession).forEach(function (e) {
        libreria.push("(" +e.categoria, e.dataLibrary_name, e.dataLibrary_location, e.accion, e.etiqueta + ")");
    });
    dataLayer.push(libreria.toString())
    ga('send', 'event', categoria, categoria + "_click", nombre, { dimension78: libreria.toString() })

}


function formSend(data) {
    var data_to_session = {
        categoria: data.categoria,
        dataLibrary_name: data.nombre,
        dataLibrary_location: data.ubicacion,
        accion: data.accion,
        etiqueta: data.etiqueta || null
    }
    dataLayer.push(data_to_session)
    return data_to_session
}





// ------ flujo 2: Marcaje Click ------
tagItems.forEach(function (e) {
    e.addEventListener('click', function (e) {
        if(e.target.dataset.tag != undefined){
            var data = JSON.parse(e.target.dataset.tag)
            if(data != undefined){
                var accion = data.accion
                if (accion === 'redirigir' || accion === 'abrir' || accion === 'seleccionar' || accion === 'cerrar') {
                    var data_to_session = click(data)
                    saveSessionStorage(data_to_session)
                } else if (accion === 'enviar' || accion ==='solicitar') {
                    if(enviado === true){
                        var data_to_session = formSend(data)
                        saveSessionStorage(data_to_session)
                        sendSessionStorage(data_to_session['categoria'], data_to_session['dataLibrary_name'])
                        setTimeout(function () {
                            sessionStorage.clear()
                        }, 2000)
                    }
                    
                }
            }
        } 
    })
})

url()