// ユーザー名
export let userName = "";
export const setUserName = (lastName,firstName) => {
    userName = lastName + " " + firstName
}

// システム利用開始年
export let sysUseStartYear= "";
// システム利用開始月
export let sysUseStartMonth= "";
export const setSysUseStartDate = (year,month) => {
    sysUseStartYear = year
    sysUseStartMonth = month
}


