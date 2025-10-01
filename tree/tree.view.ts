namespace $.$$ {
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
	}
}
