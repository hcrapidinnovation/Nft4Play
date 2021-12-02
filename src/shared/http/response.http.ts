export class HttpResponse {
  private readonly statusCode: number
  private readonly message: string
  private readonly data: any

  constructor(data?: any, statusCode = 200, message = 'success') {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }
}
