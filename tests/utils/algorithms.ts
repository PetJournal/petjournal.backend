export function getCombinations (obj: any): any {
  const entries = Object.entries(obj)
  const result: any = []
  const f = (prefix: any, entries: any): any => {
    for (let i = 0; i < entries.length; i++) {
      result.push(Object.fromEntries([...prefix, entries[i]]))
      f([...prefix, entries[i]], entries.slice(i + 1))
    }
  }
  f([], entries)
  return result
}

const object = {
  a: 1,
  b: 2,
  c: [3, 4]
}

console.log(getCombinations(object))
