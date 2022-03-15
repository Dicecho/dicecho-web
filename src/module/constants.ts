export const ORIGIN_MAP: { [key: string]: Array<string> } = {
  '本站': ['', 'dicecho.com'],
  'booth': ['booth', 'booth.pm'],
  '魔都': ['cnmods', 'www.cnmods.net'],
  '纯美苹果园': ['www.goddessfantasy.net'],
  '微博': ['weibo.com', 'weibointl.api.weibo.com', 'm.weibo.cn'],
  '哔哩哔哩': ['www.bilibili.com'],
  'pixiv': ['www.pixiv.net'],
  '100dice': ['www.100dice.com'],
  '虎之穴': ['ec.toranoana.jp'],
}

export const ORIGIN_REVERSE_MAP: { [key: string]: string } = Object.keys(ORIGIN_MAP)
  .reduce((a, b) => ({ 
      ...a, 
      ...(ORIGIN_MAP[b].reduce((x, y) => ({ ...x, [y]: b }), {})) 
  }), {})

export function getKeyFromOrigin(origin: string) {
  return ORIGIN_REVERSE_MAP[origin] || origin
}

export function getOriginsFromKey(key: string) {
  return ORIGIN_MAP[key] || [key]
}