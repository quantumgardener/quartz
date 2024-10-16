export const mastodonComment = (title: string): string => {
    return encodeURIComponent(`@dcbuchan Comment on "${title}" `)
};

export const emailComment = (title: string) => {
    const subject = encodeURIComponent(`Comment on "${title}"`)
    const emailBody = encodeURIComponent("Hi. Thanks for your comment on my content. David.")
    return `mailto:qg.info@mail.buchan.org?subject=${subject}&body=${emailBody}`
}