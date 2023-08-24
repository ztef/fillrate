/*


  VISUAL INTERACTION SYSTEMS : Worker generico que procesa querys en URLs de manera serial

   Worker: Carga una serie de querys pasados como mensaje en una estructura.
   al terminar ejecuta las funciones especificadas como "resolutores" para cada query



*/


// Al recibir el mensaje procesa los querys de manera serial :




self.onmessage = async event => {
      const { queries } = event.data;

      for (const query of queries) {
          const data = await fetchDataFromUrl(query.url);
          self.postMessage({ type: "data", data:data,id: query.id });
      }

      self.postMessage({ type: "msg", data: "end" });
  };
  
  
  
  async function fetchDataFromUrl(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Falla en query ${url}: ${response.statusText}`);
      }
  
      const data = await response.text();
      return data;
    } catch (error) {
      throw new Error(`Error en url ${url}: ${error.message}`);
    }
  }

