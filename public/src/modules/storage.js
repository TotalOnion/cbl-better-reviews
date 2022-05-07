const storage = {
    get: (key) => {
        if(typeof localStorage == 'object') {
            return localStorage.getItem(key);
        } else {
            const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
            return match ? match[2] : null;
        }
    },
    set: (key, value) => {
        if(typeof localStorage == 'object') {
            return localStorage.setItem(key, value);
        } else {
            document.cookie = key + '=' + value;
        }
    }
};

export default storage;
