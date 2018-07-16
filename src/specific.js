export const textareaSpec = {
	attachAttr(node, propName, value) {
		if (propName === "value" || propName === "defaultValue") {
			node.value = value;
		}
	}
};
