namespace $.$$ {
	interface Branch {
		id: any
		leafs: Leaf[]
	}

	function is_branch(obj: any): obj is Branch {
		return "leafs" in obj
	}

	interface Leaf {
		id: any
		title: string
		branches: Branch[]
	}

	function is_leaf(obj: any): obj is Leaf {
		return "branches" in obj
	}

	type Node = Branch | Leaf;

	export class $rm_tree extends $.$rm_tree {
		rem = this.$.$rm_theme_rem;

		@ $mol_mem
		path(label?: HTMLElement): {x: number, y: number}[] {
			if (!label) return []

			const tree = this.dom_node()
			let closest_li = label?.closest("[rm_tree_leaf]");

			let path = [];

			while (closest_li) {
				let box = closest_li.querySelector("[rm_tree_leaf_label]")?.getBoundingClientRect();
				let tree_box = tree.getBoundingClientRect();

				let x = box!.left - tree_box.left - this.rem(0.95);
				let y = box!.top - tree_box.top + (box!.height / 2);

				path.push({x, y});

				closest_li = closest_li.parentElement?.closest("[rm_tree_leaf") as Element | null;
			}

			path.reverse()

			return path
		}

		@ $mol_mem
		connection_path(label?: HTMLElement | null): [string, string] {
			if (!label) {
				return ["", ""]
			}

			const path = this.path(label);

			if (!path.length) return ["", ""]

			let lines_d = `M${path[0].x},${path[0].y}`;
			let dots_d = "";

			for (let i=1; i < path.length; i++) {
				let prev = path[i-1], cur = path[i];
				let mid_x = prev.x, mid_y = cur.y;

				lines_d += ` L${mid_x},${prev.y} Q${mid_x},${mid_y} ${cur.x},${cur.y}`;
			}

			path.forEach((pt: {x: number, y: number}) => {
				dots_d += `M${pt.x - this.rem(0.3125)},${pt.y} 
					a${this.rem(0.3125)},${this.rem(0.3125)} 0 1,0 ${this.rem(0.625)},0 
					a${this.rem(0.3125)},${this.rem(0.3125)} 0 1,0 -${this.rem(0.625)},0 `;
			});

			return [lines_d, dots_d]
		}

		@ $mol_mem
		connection_lines(label?: HTMLElement): string {
			let [lines_d,] = this.connection_path(label)

			return lines_d;
		}

		@ $mol_mem
		connection_dots(label?: HTMLElement): string {
			let [, dots_d] = this.connection_path(label)

			return dots_d;
		}

		@ $mol_mem
		branches(): readonly ($rm_tree_branch)[] {
			const branches = this.tree().map(branch => this.Branch(branch.id))

			return branches
		}

		@ $mol_mem
		leafs(id: any): readonly ($.$rm_tree_leaf)[] {
			const branch = this.tree_node(id)

			if (branch == null || is_leaf(branch)) {
				return []
			}

			const leafs = branch.leafs.map(leaf => this.Leaf(leaf.id)) ?? []

			return leafs
		}

		@ $mol_mem
		leaf_title(id: any): string {
			const node = this.tree_node(id)

			if (node == null || is_branch(node)) {
				return "..."
			}

			return node.title ?? "..."
		}

		@ $mol_mem
		leaf_branches(id: any): readonly ($rm_tree_branch)[] {
			const leaf = this.tree_node(id);

			if (leaf == null || is_branch(leaf)) {
				return []
			}

			const branches = leaf.branches.map(branch => this.Branch(branch.id)) ?? []

			return branches
		}

		@ $mol_mem
		tree_node(id: any, branches?: readonly Branch[]): Node | null {
			if (!branches) {
				branches = this.tree()
			}

			for (const branch of branches) {
				if (branch.id == id) {
					return branch;
				}

				for (const leaf of branch.leafs) {
					if (leaf.id == id) {
						return leaf;
					}

					const node_in_nested_branches = this.tree_node(id, leaf.branches);

					if (node_in_nested_branches) {
						return node_in_nested_branches;
					}
				}
			}

			return null;
		}
	}
}
