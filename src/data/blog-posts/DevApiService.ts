export async function loadArticle(articleId: string) {

    return await fetch("https://dev.to/api/articles/" + articleId, {
        method: "GET",
        headers: {
            Accept: "application/vnd.forem.api-v1+json",
        },
    })
        .then((response) => response.json())
        .catch((err) => console.error(err));
}

function addMonths(date: Date, months: number) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}

/* export async function loadArticleStats(articleId: string) {
    ///https://dev.to/api/analytics/historical?start=2023-05-28&article_id=834021
    const lastMonth = addMonths(new Date(), -1).toISOString().split('T')[0];
    return await fetch(`https://dev.to/api/analytics/historical?start=${lastMonth}&article_id=${articleId}`, {
        method: "GET",
        headers: {
            Accept: "application/vnd.forem.api-v1+json",
            'api-key': import.meta.env.DEV_API_KEY
        },
    })
        .then((response) => response.json())
        .then((byDate: any) => {
            const dateViews = Object.entries(byDate).map(([key, value]: any) => {
                return value?.page_views?.total;
            });
            const views = dateViews.reduce((a: number, b: number) => a + b, 0);
            return views;
        })
        .catch((err) => console.error(err));
} */

export async function loadAllArticles(organization: string | undefined = undefined) {
    return await fetch("https://dev.to/api/articles?username=scooperdev", {
        method: "GET",
        headers: {
            Accept: "application/vnd.forem.api-v1+json",
        },
    })
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .then(
            (response) => response
                .filter((e: any) => (organization == undefined && e.organization?.name !== 'AG Grid')
                    || (e.organization?.name === organization) && !e.description?.includes('guest post'))
        )
        .catch((err) => console.error(err));
}