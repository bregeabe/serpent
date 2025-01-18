
function handle_google_username(email) {
    return email.split('@')[0]
}

module.exports = handle_google_username