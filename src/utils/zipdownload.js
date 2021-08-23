import axios from 'axios'
import { getToken } from '@/utils/auth'

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  zip: 'application/zip',
  pdf: 'application/pdf'
}

const baseUrl = process.env.VUE_APP_BASE_API
export function downLoadZip(str) {
  var url = baseUrl + str
  axios({
    method: 'get',
    url: url,
    responseType: 'blob',
    headers: { 'Authorization': getToken() }
  }).then(res => {
    resolveBlob(res, mimeMap.zip)
  })
}

export function exportFile(path, data) {
  var url = baseUrl + path
  axios({
    method: 'post',
    url: url,
    responseType: 'blob',
    data: data,
    headers: { 'Authorization': getToken() }
  }).then(res => {
    resolveBlob(res, mimeMap.xlsx)
  })
}

export function previewPdf(str) {
  axios({
    method: 'get',
    url: baseUrl + str,
    responseType: 'arraybuffer',
    headers: { 'Authorization': getToken() }
  }).then(res => {
    //获取blob链接
    var pdfUrl = window.URL.createObjectURL(new Blob([res.data], { type: mimeMap.pdf }));
    window.open(pdfUrl);
  })
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement('a')
  var blob = new Blob([res.data], { type: mimeType })
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var contentDisposition = decodeURI(res.headers['content-disposition'])
  var result = patt.exec(contentDisposition)
  var fileName = result[1]
  fileName = fileName.replace(/\"/g, '')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.appendChild(aLink)
}
