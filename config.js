var config = {};

config.parse = {
    appId:  "twqir8iySLnWPUlcjsm4fPCQnUtw4FKC5KO3gz6Z",//"ZowTKUYLhAaotnClMdlMrrPnG0xiQVHPWnHWuAf3",
    JSKey: "3aMFsko8xI84k1fdWMmiexsj8eNidaTemHYGPULe", //"n3U6xyK4bcJ1O9WPDh1rcADiY7C84UeRyebo096
    MsKey: "ORon0LBiI5wxG0RgbYzGirpmPdOXXB6x6FQhNEHH"
};

config.accounts = {
    free: {
      payment: 0,
      period: 0,
      periodType: 'forever'
    },
    student: {
        payment: 149,
        period: 1,
        periodType: 'year'
    },
    premium : {
        payment: 449,
        period: 5,
        periodType: 'year'
    },
    company: {
        payment: 999,
        period: 1,
        periodType: 'year'
    }
};

config.currency = 'usd';

config.stripe = "sk_test_BQokikJOvBiI2HlWgH4olfQ2";

module.exports = config;