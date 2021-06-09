import naxios from '@/libs/api.request'
import qs from 'qs'
export const entitySaleBatch = params => {
    return naxios.request({
        url: 'sale/entitySaleBatch',
        params
    })
}
