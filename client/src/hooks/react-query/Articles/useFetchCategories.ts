// import { extractErrorData } from '@utils/extractErrorDetails'
// import { getArticles } from '@services/articles.service'
// import { queriesKeys } from '@config/reactQueryKeys'
// import { useQuery } from '@tanstack/react-query'
// import { toast } from 'sonner'

// const useFetchCategories = () => {
//    const { data, isPending, error, isError } = useQuery({
//       queryKey: [queriesKeys.FETCH_CATEGORIES],
//       queryFn: getCategories,
//       staleTime: 20 * 60 * 1000, //20min
//       retry: 1,
//    })

//    if (isError && error.message !== 'Network Error') {
//       const { message } = extractErrorData(error)

//       toast.error(message, {
//          id: `error-${queriesKeys.FETCH_ARTICLES}`,
//       }) //Seteo un ID para evitar toast duplicados
//    }

//    return {
//       articles: data?.articles || [],
//       categories: data?.categories || {},
//       isPending,
//       isError,
//       error,
//    }
// }

// export default useFetchCategories
