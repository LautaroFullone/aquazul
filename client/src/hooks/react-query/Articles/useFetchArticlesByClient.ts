import { getArticlesByClient } from '@services/articles.service'
import { extractErrorData } from '@utils/extractErrorDetails'
import { queriesKeys } from '@config/reactQueryKeys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const useFetchArticlesByClient = (params: { clientId: string | undefined }) => {
   const { data, isLoading, error, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_ARTICLES, params.clientId],
      queryFn: () => getArticlesByClient(params.clientId!),
      enabled: !!params.clientId,
      staleTime: 20 * 60 * 1000, //20min
      retry: 1,
   })

   if (isError && error.message !== 'Network Error') {
      const { message } = extractErrorData(error)

      toast.error(message, {
         id: `error-${queriesKeys.FETCH_ARTICLES}`,
      }) //Seteo un ID para evitar toast duplicados
   }

   // const mockArticles = [
   //    {
   //       id: 'cmfiqv8y1000o1ugs0iqs6fqr',
   //       name: 'Alfombra de 50cm',
   //       basePrice: 6000,
   //       code: 'ART-0013',
   //       category: {
   //          id: 'cmfiqupif000l1ugsahu5k27p',
   //          name: 'Alfombra',
   //       },
   //       clientPrice: 6000,
   //    },
   //    {
   //       id: 'cmfiqv1h8000m1ugskb8oqvwv',
   //       name: 'Alfombra de 30cm',
   //       basePrice: 4500,
   //       code: 'ART-0012',
   //       category: {
   //          id: 'cmfiqupif000l1ugsahu5k27p',
   //          name: 'Alfombra',
   //       },
   //       clientPrice: 4500,
   //    },
   //    {
   //       id: 'cmfiqupif000k1ugsdc8z2p03',
   //       name: 'Alfombra de 20cm',
   //       basePrice: 2500,
   //       code: 'ART-0011',
   //       category: {
   //          id: 'cmfiqupif000l1ugsahu5k27p',
   //          name: 'Alfombra',
   //       },
   //       clientPrice: 2500,
   //    },
   //    {
   //       id: 'cmfiqttbr000i1ugswnstezzn',
   //       name: 'Funda Almohada LG',
   //       basePrice: 1300,
   //       code: 'ART-0010',
   //       category: {
   //          id: 'cmfiqsyx5000f1ugs3gem4lq7',
   //          name: 'Fundas',
   //       },
   //       clientPrice: 1300,
   //    },
   //    {
   //       id: 'cmfiqtfif000g1ugsl6nditwk',
   //       name: 'Funda Almohada MD',
   //       basePrice: 900,
   //       code: 'ART-0009',
   //       category: {
   //          id: 'cmfiqsyx5000f1ugs3gem4lq7',
   //          name: 'Fundas',
   //       },
   //       clientPrice: 900,
   //    },
   //    {
   //       id: 'cmfiqsyx5000e1ugs4wc9v9eq',
   //       name: 'Funda Almohada XS',
   //       basePrice: 500,
   //       code: 'ART-0008',
   //       category: {
   //          id: 'cmfiqsyx5000f1ugs3gem4lq7',
   //          name: 'Fundas',
   //       },
   //       clientPrice: 500,
   //    },
   //    {
   //       id: 'cmfiqnn2p000c1ugspy99hhbt',
   //       name: 'Cortinas Ducha Grande',
   //       basePrice: 1800,
   //       code: 'ART-0007',
   //       category: {
   //          id: 'cmfiqn49200091ugstri9l6ma',
   //          name: 'Cortinas',
   //       },
   //       clientPrice: 1800,
   //    },
   //    {
   //       id: 'cmfiqndjy000a1ugs1noaqj58',
   //       name: 'Cortinas Ducha Mediana',
   //       basePrice: 1500,
   //       code: 'ART-0006',
   //       category: {
   //          id: 'cmfiqn49200091ugstri9l6ma',
   //          name: 'Cortinas',
   //       },
   //       clientPrice: 1500,
   //    },
   //    {
   //       id: 'cmfiqn49200081ugsidviozsv',
   //       name: 'Cortinas Ducha Chica',
   //       basePrice: 750,
   //       code: 'ART-0005',
   //       category: {
   //          id: 'cmfiqn49200091ugstri9l6ma',
   //          name: 'Cortinas',
   //       },
   //       clientPrice: 750,
   //    },
   //    {
   //       id: 'cmfiqmd7300061ugs8f838vua',
   //       name: 'Sabana 3 Plazas',
   //       basePrice: 3000,
   //       code: 'ART-0004',
   //       category: {
   //          id: 'cmfelvuc100011us4ngd25chh',
   //          name: 'Sabanas',
   //       },
   //       clientPrice: 3000,
   //    },
   //    {
   //       id: 'cmfiqm42300041ugse7klnjgu',
   //       name: 'Sabana 2 plazas',
   //       basePrice: 2000,
   //       code: 'ART-0003',
   //       category: {
   //          id: 'cmfelvuc100011us4ngd25chh',
   //          name: 'Sabanas',
   //       },
   //       clientPrice: 2000,
   //    },
   //    {
   //       id: 'cmfiqlpze00021ugsdyqjqhh6',
   //       name: 'Sabana 1 Plaza',
   //       basePrice: 1000,
   //       code: 'ART-0002',
   //       category: {
   //          id: 'cmfelvuc100011us4ngd25chh',
   //          name: 'Sabanas',
   //       },
   //       clientPrice: 1000,
   //    },
   // ]

   // const mockCategories = {
   //    cmfiqupif000l1ugsahu5k27p: 'Alfombra',
   //    cmfiqsyx5000f1ugs3gem4lq7: 'Fundas',
   //    cmfiqn49200091ugstri9l6ma: 'Cortinas',
   //    cmfelvuc100011us4ngd25chh: 'Sabanas',
   // }
   // return {
   //    articles: mockArticles, //data?.articles || [],
   //    categories: mockCategories,
   //    isLoading: false,
   //    isError,
   //    error,
   // }
   return {
      articles: data?.articles || [],
      categories: data?.categories || {},
      isLoading,
      isError,
      error,
   }
}

export default useFetchArticlesByClient
