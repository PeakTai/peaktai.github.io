export function readFileAsBuffer(file: Blob): Promise<ArrayBuffer> {
  return new Promise(function (resolve, reject) {
    const fileReader = new FileReader()
    fileReader.onload = (evt: any) => {
      const buffer: ArrayBuffer = evt.target.result
      resolve(buffer)
    }
    fileReader.onerror = error => {
      reject(error)
    }
    fileReader.readAsArrayBuffer(file)
  })
}
