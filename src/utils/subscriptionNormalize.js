export const subscriptionNormalize = (subscription) => {
    if (subscription === 'unlimited') {
        return 'Unlimited'
    } else if (subscription === 'pro') {
        return 'Pro'
    } else if (subscription === 'free') {
        return 'Free'
    }
}