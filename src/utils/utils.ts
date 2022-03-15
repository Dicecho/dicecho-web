export function sleepAsync(milliseconds: number) {
  return new Promise(resolve => setTimeout(() => resolve, milliseconds))
}

export function timeoutPromise<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    let timeout = setTimeout(() => {
      reject('Operation timed out after ' + ms + ' ms')
    }, ms)

    promise.then((res) => {
      clearTimeout(timeout)
      resolve(res)
    })

  })
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

export function parseJwt (token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};