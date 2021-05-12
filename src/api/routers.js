import naxios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return naxios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}
