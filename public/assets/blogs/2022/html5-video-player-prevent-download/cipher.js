const BLOCK_SIZE = 64

const key = new TextEncoder().encode(
  '9395e32a704c40b9a2e25b109d46d9ac1a83ae0faba540d398af9d818cb99ec7'
)
/**
 *
 * @param {ArrayBuffer} bytes
 * @returns {ArrayBuffer}
 */
function encrypt(bytes) {
  let offset = 0
  const dataView = new DataView(bytes)
  const arrRes = new ArrayBuffer(dataView.byteLength)
  const result = new DataView(arrRes)
  while (offset < dataView.byteLength) {
    let currentBlockSize = BLOCK_SIZE
    if (offset + currentBlockSize > dataView.byteLength) {
      currentBlockSize = dataView.byteLength - offset
    }
    for (let i = 0; i < currentBlockSize; i++) {
      result.setUint8(offset + i, dataView.getUint8(offset + i) ^ key[i])
    }
    offset = offset + currentBlockSize
  }
  return arrRes
}
/**
 *
 * @param {ArrayBuffer} bytes
 * @returns {ArrayBuffer}
 */
function decrypt(bytes) {
  let offset = 0
  const dataView = new DataView(bytes)
  const arrRes = new ArrayBuffer(dataView.byteLength)
  const result = new DataView(arrRes)
  while (offset < dataView.byteLength) {
    let currentBlockSize = BLOCK_SIZE
    if (offset + currentBlockSize > dataView.byteLength) {
      currentBlockSize = dataView.byteLength - offset
    }
    for (let i = 0; i < currentBlockSize; i++) {
      result.setUint8(offset + i, dataView.getUint8(offset + i) ^ key[i])
    }
    offset = offset + currentBlockSize
  }
  return arrRes
}
