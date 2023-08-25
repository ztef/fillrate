/*

VISUAL INTERACTION SYSTEMS : Worker processor

Worker: Carga una serie de querys pasados como mensaje en una estructura.
al terminar ejecuta call back con cada uno



*/


function processQueriesWithWorker(queries, resultCallback) {
    const worker = new Worker("js/workerRemote.js");

    worker.onmessage = event => {
        const message = event.data;

        if (message.type === "data") {
            resultCallback(message.id, message.data);
        } else if (message.type === "msg") {
            console.log("todos los querys procesados");
            worker.terminate();
        }
    };

    worker.postMessage({ queries });
}