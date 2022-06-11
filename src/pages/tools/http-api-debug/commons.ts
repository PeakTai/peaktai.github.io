export enum Method {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  PATCH = 'PATCH'
}

/**
 * 所有程序可以支持的请求 content-type .
 */
export enum RequestContentType {
  TEXT = 'text/plain',
  URLENCODE = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
  MULTIPART = 'multipart/form-data'
}

export interface Parameter {
  name: string
  text: string
  file?: Blob
  type: 'text' | 'file'
  enabled: boolean
}

export interface Header {
  name: string
  value: string
  enabled: boolean
}
