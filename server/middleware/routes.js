module.exports = {
    routes: [
        {
            path: '/api/auth',
            authenticationRequired: false
        },
        {
            path: '/api/auth/login',
            authenticationRequired: false
        },
        {
            path: '/api/auth/refresh_token',
            authenticationRequired: false
        },
        {
            path: '/api/user_profile',
            authenticationRequired: true
        },  
        {
            path: '/api/plaid_token/create_link_token',
            authenticationRequired: true
        },
        {
            path: '/api/plaid_token/get_access_token',
            authenticationRequired: true
        },
        {
            path: '/api/records/accounts',
            authenticationRequired: true
        },
        {
            path: '/api/records/transactions',
            authenticationRequired: true
        },
        {
            path: '/api/records/account',
            authenticationRequired: true
        }
    ]
}