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