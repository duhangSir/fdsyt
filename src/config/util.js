export const formatNumber = (num) => {
    return num >= 1e3 && num < 1e4 ?
        (num / 1e3).toFixed(1) + "k" :
        num >= 1e4 ?
        (num / 1e4).toFixed(1) + "w" :
        num;
}

export const validatorPhone = (val) => {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(val);
}

export const judgeApp = ({
    ios,
    android
}) => {
    return new Promise((resolve, reject) => {
        try {
            if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                if (ios.go) {
                    ios.go();
                } else {
                    if (ios.event) {
                        window.webkit.messageHandlers[ios.event].postMessage(
                            ios.params
                        );
                    }
                }
                resolve(true);
            } else {
                if (android.go) {
                    android.go();
                } else {
                    if (android.event) {
                        // let params 
                        android.params ? window.android[android.event](...android.params) : window.android[android.event]();
                    }
                }
                resolve(true);
            }
        } catch (error) {
            reject(error);
        }
    });
};
