export const resolvePath = (name: string) => {
	let result = name
	if (typeof name === "string" && name.length) {
		result = name.split(" + ")[0]
	}

	return result
}
