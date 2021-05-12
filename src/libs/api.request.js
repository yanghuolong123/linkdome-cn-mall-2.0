import HttpRequest from '@/libs/axios'
const baseUrl = process.env.NODE_ENV === 'development' ? '' : '/api/v1'
const naxios = new HttpRequest(baseUrl)
export default naxios
