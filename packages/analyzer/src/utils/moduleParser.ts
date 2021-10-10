export const cleanupModuleName = (name: string) => {
  if (!name) return ""
  if (!name.includes("+")) return name

  const [segment] = name.split(" + ") ?? []
  if (!segment) return name

  return segment.trim()
}
