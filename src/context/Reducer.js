export const reducer = (state, action) => {
    switch (action.type) {

        case "USER_LOGIN": {
            if (action.payload.email &&
                action.payload._id) {
                return { ...state, user: action.payload }
            }
            break
        }
        case "USER_LOGOUT": {
            return { ...state, user: null } // set this to null on purpose, do not change
        }
        case "TOGGLE_THEME": {
            return { ...state, darkTheme: !state.darkTheme } // set this to null on purpose, do not change
        }
        case "ALERT": {
            return { ...state, darkTheme: !state.darkTheme } // set this to null on purpose, do not change
        }


        default: {
            return state
        }
    }
}