import CryptoJS from 'crypto-js'
/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */

const keyWords = 'aPgjc84Yfnv1adqI'

// 加密
function aesEncrypt(word: string, keyWord = keyWords) {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const srcWords = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcWords, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}
// 解密
function encrypted(word: string, keyWord = keyWords) {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

export { aesEncrypt, encrypted }
