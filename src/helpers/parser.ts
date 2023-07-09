export const parseRequest = async (buf:ArrayBuffer):Promise<string> => {
    let data:string = '';
    for (const chunk of buf) {
        data += chunk;
    }
    return data;
};


export const readBinaryStringFromArrayBuffer (arrayBuffer, onSuccess, onFail) {
    var reader = new FileReader();
    reader.onload = function (event) {
      onSuccess(event.target.result);
    };
    reader.onerror = function (event) {
      onFail(event.target.error);
    };
    reader.readAsBinaryString(new Blob([ arrayBuffer ],
      { type: 'application/octet-stream' }));
}